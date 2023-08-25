import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { autoplay } from '../../utils/Helpers/autoplay';
import { db } from '../../utils/Helpers/db';
import { ThemeProvider } from '@emotion/react';
import { List, ListItemButton, ListItemIcon, ListItemText, createTheme } from '@mui/material';
import { useWords } from '../../utils/hooks/useWords';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Grid, Pagination } from 'swiper/modules';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AppsIcon from '@mui/icons-material/Apps';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Pad from '../../components/Pad/Pad';
import CategoryModal from '../../components/CategoryModal/CategoryModal';
import logo from '../../assets/img/logo-gradient.svg';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import styles from './App.module.css';

function App(props) {
    let {
        sentence,
        setSentence,
        speech,
        setSpeech,
        connected,
        setConnected,
        myController,
        setMyController,
        currentTarget,
        setCurrentTarget,
        openModal,
        setOpenModal,
        category
    } = useContext(AppContext);
    const [padPerLine, setPadPerline] = useState(5);
    const [firstOfTheLine, setFirstOfLine] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);
    const navigate = useNavigate();
    const swiper = useSwiper();
    const swiperRef = useRef();
    const words = useWords('Présentation');

    const reccurentsWords = useLiveQuery(async () => {
        return await db.words.where('category').equals('Récurrent').limit(3).toArray();
    });

    const makeSentence = (word, sound) => {
        setSentence(sentence + ' ' + word);
        setSpeech([...speech, sound]);
    };

    const clearSentence = () => {
        setSentence('');
        setSpeech([]);
    };

    const selectPad = (event) => {
        const targets = document.querySelectorAll('button.selectable');
        const recurrentPads = document.querySelectorAll('.recurrent');
        const optionsPads = document.querySelectorAll('.options');
        const { data } = event;
        const padData = data.getUint8(2);
        const firstLine = recurrentPads.length + optionsPads.length;
        const body = document.querySelector('body');
        const otherPages = swiperRef.current.snapGrid.length - 1;
        const totalPerRow = padPerLine + otherPages;
        const slideIndex = swiperRef.current.snapIndex;

        body.addEventListener('click', () => {
            setCurrentTarget((currentTarget = 0));
            setRowIndex(0);
            setFirstOfLine(0);
        });

        switch (padData) {
            case 32:
                clearSentence();
                break;
            case 16:
                if (!openModal) {
                    if (currentTarget + totalPerRow > targets.length - 1) {
                        setCurrentTarget((currentTarget = 0));
                        setRowIndex(0);
                        setFirstOfLine(0);
                    } else {
                        if (currentTarget === 0) {
                            setCurrentTarget((currentTarget += firstLine));
                        } else if (currentTarget <= firstLine) {
                            setCurrentTarget((currentTarget += firstLine + slideIndex));
                            setFirstOfLine(firstLine + 1);
                        } else if (currentTarget > firstLine) {
                            setCurrentTarget((currentTarget += totalPerRow));
                            setRowIndex((r) => r + 1);
                            setFirstOfLine(firstLine + totalPerRow * (rowIndex + 1) + 1);
                        }
                    }
                } else {
                    currentTarget === targets.length - 1 ? setCurrentTarget((currentTarget = 0)) : setCurrentTarget((currentTarget += 1));
                }
                break;
            case 8:
                if (currentTarget < targets.length - 1) {
                    if (currentTarget === firstLine) {
                        slideIndex !== 0 && swiperRef.current.slideTo(0)
                        setFirstOfLine(currentTarget + 1);
                        setCurrentTarget((currentTarget += 1));
                    } else if (currentTarget > firstLine && currentTarget >= firstOfTheLine + padPerLine - 1 && currentTarget < firstOfTheLine + totalPerRow - 1) {
                        swiperRef.current.slideNext();
                        setCurrentTarget((currentTarget += 1));
                    } else if (currentTarget === firstOfTheLine + totalPerRow - 1) {
                        swiperRef.current.slideTo(0);
                        setCurrentTarget((currentTarget += 1));
                        setFirstOfLine(currentTarget);
                    } else {
                        setCurrentTarget((currentTarget += 1));
                    }
                } else {
                    if (slideIndex < otherPages) {
                        swiperRef.current.slideNext()
                    } else {
                        setCurrentTarget(0);
                        setRowIndex(0);
                        setFirstOfLine(0);
                    }
                }
                break;
            case 4:
                targets[currentTarget].click();
                break;
            default:
                break;
        }

        console.log('index => ', currentTarget);
        console.log('ligne => ', rowIndex);
        console.log('1er de la ligne => ', firstOfTheLine);
        targets[currentTarget].focus();
    };

    const openController = async () => {
        if (!myController.vendorId) {
            const devices = await navigator.hid.getDevices();
            setMyController(devices[0]);
        }
        try {
            if (!myController.opened) await myController.open();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickOpen = () => {
        setOpenModal(true);
        setCurrentTarget((currentTarget = 0));
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        openController();
        myController.oninputreport = (e) => selectPad(e);
        // window.electronAPI.handleDeviceRemoved((event, value) => {
        //     if (value === 'removed') {
        //         setConnected(false);
        //         navigate('/');
        //     }
        // });
    }, [openModal, category, firstOfTheLine, rowIndex, myController, openController]);

    return (
        <div className={styles.wrapper}>
            <header className={styles.appHeader}>
                <div className={styles.headerContainer}>
                    {connected && (
                        <div className={styles.deviceStatus}>
                            <div className={styles.led}></div>
                            <span>{myController.productName} est connecté</span>
                        </div>
                    )}
                    <h1 className={styles.headerH1}>
                        <img src={logo} alt="logo de hello talk" /> Marius system
                    </h1>
                    <nav className={styles.navbar}>
                        <ThemeProvider theme={navTheme}>
                            <List component={'ul'}>
                                <ListItemButton>
                                    <Link className={styles.navLink}>
                                        <ListItemIcon>
                                            <InfoOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Connexion" />
                                    </Link>
                                </ListItemButton>
                                <ListItemButton>
                                    <Link className={styles.navLink} to={'/dashboard'}>
                                        <ListItemIcon>
                                            <ExitToAppIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Tableau de bord" />
                                    </Link>
                                </ListItemButton>
                            </List>
                        </ThemeProvider>
                    </nav>
                </div>
            </header>
            <main className={styles.content}>
                <CategoryModal isOpen={openModal} onClose={handleClose} title="Catégories" />
                <div className={styles.speechWrapper}>
                    <button className={styles.iconContainer} onClick={clearSentence}>
                        <BackspaceOutlinedIcon className="delete" />
                    </button>
                    <input type="text" name="speech" value={sentence} readOnly tabIndex={-1} />
                    <button className={`${styles.iconContainer} ${!openModal ? 'selectable' : ''}`} onClick={() => autoplay(0, speech)}>
                        <RecordVoiceOverIcon className="play" />
                    </button>
                </div>
                <div className={styles.cardsContainer}>
                    {reccurentsWords?.map((word) => (
                        <Pad
                            key={word.id}
                            permanent={true}
                            id={word.id}
                            word={word.original}
                            engWord={word.engTranslation}
                            sound={word.sound}
                            callback={() => makeSentence(word.original, word.sound)}
                        />
                    ))}
                    <Pad outlined={true} icon={<AppsIcon />} word="Menu" callback={handleClickOpen} />
                    <Pad outlined={true} icon={<FormatAlignLeftIcon />} word="Liste" callback={() => console.log()} />
                    <Swiper
                        slidesPerView={padPerLine}
                        pagination={{ clickable: true }}
                        grid={{ fill: 'row', rows: 3 }}
                        spaceBetween={17}
                        modules={[Grid, Pagination]}
                        className={styles.mySwiper}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {words?.map((word) => (
                            <SwiperSlide key={word.id} className={styles.swiperSlide}>
                                <Pad
                                    id={word.id}
                                    word={word.original}
                                    engWord={word.engTranslation}
                                    sound={word.sound}
                                    callback={() => makeSentence(word.original, word.sound)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </main>
        </div>
    );
}

const navTheme = createTheme({
    components: {
        MuiList: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    gap: '12px'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: '30px',
                    padding: '0',
                    '&:hover': {
                        backgroundColor: '#fcde9c36',
                        '& .MuiListItemIcon-root, .MuiTypography-root': {
                            color: 'var(--yellow-primary)',
                            fontWeigth: '400'
                        }
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 'unset',
                    color: 'var(--blue-lavander)'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    '& .MuiTypography-root': { fontSize: '14px', fontFamily: 'DM sans' }
                }
            }
        }
    }
});

export default App;
