import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../utils/Context/AppContext';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { autoplay } from '../../utils/Helpers/autoplay';
import { db } from '../../utils/Helpers/db';
import { ThemeProvider } from '@emotion/react';
import { List, ListItemButton, ListItemIcon, ListItemText, createTheme } from '@mui/material';
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
import SentenceModal from '../../components/SentenceModal/SentenceModal';
import logo from '../../assets/img/logo-gradient.svg';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import styles from './App.module.css';
import PlanModal from '../../components/PlanModal/PlanModal';

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
        openCategoryModal,
        setOpenCategoryModal,
        openSentenceModal,
        setOpenSentenceModal,
        category,
        words
    } = useContext(AppContext);
    const navigate = useNavigate()
    const [padPerLine, setPadPerline] = useState(5);
    const [firstOfRow, setFirstOfRow] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);
    const [openPlan, setOpenPlan] = useState(false)
    const swiper = useSwiper();
    const swiperRef = useRef();
    const allWords = useLiveQuery(async () => await db.words.orderBy('id').filter(word => word.category !== "Récurrent").toArray());

    const reccurentsWords = useLiveQuery(async () => {
        return await db.words.where('category').equals('Récurrent').limit(3).sortBy('id');
    });

    const makeSentence = (word, sound) => {
        setSentence(sentence + ' ' + word);
        setSpeech([...speech, sound]);
    };

    const clearSentence = () => {
        setSentence('');
        setSpeech([]);
    };

    const selectPad = useCallback(
        (event) => {
            const targets = document.querySelectorAll('button.selectable');
            const recurrentPads = document.querySelectorAll('.recurrent');
            const optionsPads = document.querySelectorAll('.options');
            const { data } = event;
            const padData = data.getUint8(2);
            const firstRow = recurrentPads.length + optionsPads.length;
            const otherPages = swiperRef.current.snapGrid.length - 1;
            const totalPerRow = padPerLine + otherPages;
            const slideIndex = swiperRef.current.snapIndex;

            switch (padData) {
                case 32:
                    clearSentence();
                    break;
                case 16:
                    if (!openCategoryModal && !openSentenceModal) {
                        if (currentTarget + totalPerRow > targets.length - 1) {
                            setCurrentTarget((currentTarget = 0));
                            setRowIndex(0);
                            setFirstOfRow(0);
                        } else {
                            if (currentTarget === 0) {
                                setCurrentTarget((currentTarget += firstRow));
                            } else if (currentTarget <= firstRow) {
                                setCurrentTarget((currentTarget += firstRow + slideIndex));
                                setFirstOfRow(firstRow + 1);
                            } else if (currentTarget > firstRow) {
                                setCurrentTarget((currentTarget += totalPerRow));
                                setRowIndex((r) => r + 1);
                                setFirstOfRow(firstRow + totalPerRow * (rowIndex + 1) + 1);
                            }
                        }
                    } else {
                        currentTarget === targets.length - 1 ? setCurrentTarget((currentTarget = 0)) : setCurrentTarget((currentTarget += 1));
                    }
                    break;
                case 8:
                    if (currentTarget < targets.length - 1) {
                        if (currentTarget === firstRow) {
                            slideIndex !== 0 && swiperRef.current.slideTo(0);
                            setFirstOfRow(currentTarget + 1);
                            setCurrentTarget((currentTarget += 1));
                        } else if (
                            currentTarget > firstRow &&
                            currentTarget >= firstOfRow + padPerLine - 1 &&
                            currentTarget < firstOfRow + totalPerRow - 1 &&
                            !openCategoryModal &&
                            !openSentenceModal
                        ) {
                            swiperRef.current.slideNext();
                            setCurrentTarget((currentTarget += 1));
                        } else if (currentTarget === firstOfRow + totalPerRow - 1) {
                            swiperRef.current.slideTo(0);
                            setCurrentTarget((currentTarget += 1));
                            setFirstOfRow(currentTarget);
                        } else {
                            setCurrentTarget((currentTarget += 1));
                        }
                    } else {
                        if (slideIndex < otherPages && !openCategoryModal && !openSentenceModal) {
                            swiperRef.current.slideNext();
                        } else {
                            setCurrentTarget(0);
                            setRowIndex(0);
                            setFirstOfRow(0);
                        }
                    }
                    break;
                case 4:
                    targets[currentTarget].click();
                    break;
                default:
                    break;
            }
            targets[currentTarget].focus();
        },
        [openCategoryModal, openSentenceModal, category, words, firstOfRow, rowIndex]
    );

    const openController = useCallback(async () => {
        if (!myController.vendorId) {
            const devices = await navigator.hid.getDevices();
            setMyController(devices[0]);
        }
        try {
            if (!myController.opened) await myController.open();
        } catch (error) {
            console.error(error);
        }
    }, [myController, setMyController])
    

    const handleCategoryModal = () => {
        setOpenCategoryModal(true);
        setCurrentTarget((currentTarget = 0));
    };

    const handleSentenceModal = () => {
        setOpenSentenceModal(true);
        setCurrentTarget((currentTarget = 0));
    };

    const handleClose = () => {
        setOpenCategoryModal(false);
        setOpenSentenceModal(false);
        setOpenPlan(false)
        setCurrentTarget((currentTarget = 0));
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
    }, [myController, openController, selectPad]);

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
                                <ListItemButton onClick={() => setOpenPlan(true)}>
                                    <Link className={styles.navLink}>
                                        <ListItemIcon>
                                            <InfoOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Raccordement" />
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
                <CategoryModal isOpen={openCategoryModal} onClose={handleClose} />
                <SentenceModal isOpen={openSentenceModal} onClose={handleClose} />
                <PlanModal isOpen={openPlan} onClose={handleClose}/>
                <div className={styles.speechWrapper}>
                    <button className={styles.iconContainer} onClick={clearSentence}>
                        <BackspaceOutlinedIcon className="delete" />
                    </button>
                    <input type="text" name="speech" value={sentence} readOnly tabIndex={-1} />
                    <button className={`${styles.iconContainer} ${!openCategoryModal && !openSentenceModal ? 'selectable' : ''}`} onClick={() => autoplay(0, speech)}>
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
                    <Pad outlined={true} icon={<AppsIcon />} word="Menu" callback={handleCategoryModal} />
                    <Pad outlined={true} icon={<FormatAlignLeftIcon />} word="Liste" callback={handleSentenceModal} />
                    <Swiper
                        slidesPerView={padPerLine}
                        pagination={{ clickable: true }}
                        grid={{ fill: 'row', rows: 3 }}
                        spaceBetween={17}
                        modules={[Grid, Pagination]}
                        className={styles.mySwiper}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {words?.length > 0
                            ? words?.map((word) => (
                                  <SwiperSlide key={word.id} className={styles.swiperSlide}>
                                      <Pad
                                          id={word.id}
                                          word={word.original}
                                          engWord={word.engTranslation}
                                          sound={word.sound}
                                          callback={() => makeSentence(word.original, word.sound)}
                                      />
                                  </SwiperSlide>
                              ))
                            : allWords?.map((word) => (
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
