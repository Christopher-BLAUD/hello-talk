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
import Word from '../../controllers/words';
import Category from '../../controllers/categories';
import Sentence from '../../controllers/sentences';
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
import PlanModal from '../../components/PlanModal/PlanModal';
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
        openCategoryModal,
        setOpenCategoryModal,
        openSentenceModal,
        setOpenSentenceModal,
        category,
        words
    } = useContext(AppContext);
    const navigate = useNavigate();
    const [padPerLine] = useState(4);
    const [firstOfRow, setFirstOfRow] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);
    const [openPlan, setOpenPlan] = useState(false);
    const [wordsUsed, setWordsUsed] = useState([]);
    const swiper = useSwiper();
    const swiperRef = useRef();

    const allWords = useLiveQuery(async () => {
        return await db.words
            .orderBy('id')
            .filter((word) => word.category !== 'Récurrent')
            .toArray();
    });

    const reccurentsWords = useLiveQuery(async () => {
        return await db.words.where('category').equals('Récurrent').limit(2).sortBy('id');
    });

    const makeSentence = (word, sound, id, category) => {
        setSentence(() => {
            if (sentence === '') return word;
            else return sentence + ' ' + word;
        });

        setSpeech([...speech, sound]);
        setWordsUsed([...wordsUsed, { id: id, category: category }]);
    };

    const clearSentence = () => {
        setSentence('');
        setSpeech([]);
    };

    const saveScore = async (words) => {
        const sentenceQuery = await Sentence.findOne(sentence);
        if (sentenceQuery.length > 0) {
            const currentSentence = sentenceQuery[0];
            await Sentence.updateScore(currentSentence.id, { score: (currentSentence.score || 0) + 1 });
        }

        words.forEach(async (word) => {
            try {
                const wordQuery = await Word.getWord(word.id);
                const currentWord = wordQuery[0];
                await Word.update(currentWord.id, { score: (currentWord.score || 0) + 1 });

                const categoryQuery = await Category.findOne(currentWord.category);
                const currentCategory = categoryQuery[0];
                await Category.updateScore(currentCategory.id, { score: (currentCategory.score || 0) + 1 });
            } catch (e) {
                console.error(e);
            }
        });
    };

    const saveSentence = async () => {
        const mySentence = new Sentence(sentence, speech);

        try {
            const result = await Sentence.findOne(sentence);
            if (result.length === 0) {
                await mySentence.save();
                autoplay(0, speech);
            } else {
                autoplay(0, speech);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handlePadPressed = useCallback(
        (event) => {
            const buttons = document.querySelectorAll('button.selectable');
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
                    if (currentTarget > firstRow) {
                        if (currentTarget === buttons.length - 1 && currentTarget - firstOfRow < totalPerRow) {
                            let rowLength = currentTarget - firstOfRow + 1;
                            setCurrentTarget((currentTarget -= padPerLine - (totalPerRow - rowLength)));
                        } else if (currentTarget === firstOfRow) {
                            setCurrentTarget(firstOfRow);
                        } else if (currentTarget - padPerLine < firstOfRow) {
                            setCurrentTarget((currentTarget -= 1));
                        } else {
                            setCurrentTarget((currentTarget -= padPerLine));
                        }
                        swiperRef.current.slideTo(slideIndex - padPerLine);
                    } else {
                        clearSentence();
                    }
                    break;
                case 16:
                    if (!openCategoryModal && !openSentenceModal) {
                        if (currentTarget + totalPerRow > buttons.length - 1) {
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
                        currentTarget === buttons.length - 1 ? setCurrentTarget((currentTarget = 0)) : setCurrentTarget((currentTarget += 1));
                    }
                    break;
                case 8:
                    if (currentTarget < buttons.length - 1) {
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
                    buttons[currentTarget].click();
                    break;
                default:
                    break;
            }
            buttons[currentTarget].focus();
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
    }, [myController, setMyController]);

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
        setOpenPlan(false);
        setCurrentTarget((currentTarget = 0));
    };

    useEffect(() => {
        // openController();
        // myController.oninputreport = (e) => handlePadPressed(e);
        // window.electronAPI.handleDeviceRemoved((event, value) => {
        //     if (value === 'removed') {
        //         setConnected(false);
        //         navigate('/');
        //     }
        // });
    }, [myController, openController, handlePadPressed, setConnected, navigate]);

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
                                        <ListItemText primary="Connection" />
                                    </Link>
                                </ListItemButton>
                                <ListItemButton>
                                    <Link className={styles.navLink} to={'/dashboard'}>
                                        <ListItemIcon>
                                            <ExitToAppIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard" />
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
                <PlanModal isOpen={openPlan} onClose={handleClose} />
                <div className={styles.speechWrapper}>
                    <button className={styles.iconContainer} onClick={clearSentence}>
                        <BackspaceOutlinedIcon className="delete" />
                    </button>
                    <input type="text" name="speech" value={sentence} readOnly tabIndex={-1} />
                    <button
                        className={`${styles.iconContainer} ${!openCategoryModal && !openSentenceModal ? 'selectable' : ''}`}
                        onClick={() => {
                            saveSentence();
                            saveScore(wordsUsed);
                        }}
                    >
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
                            engWord={word.translation}
                            sound={word.sound}
                            callback={() => makeSentence(word.original, word.sound, word.id, word.category)}
                        />
                    ))}
                    <Pad outlined={true} icon={<AppsIcon />} word="Menu" callback={handleCategoryModal} />
                    <Pad outlined={true} icon={<FormatAlignLeftIcon />} word="List" callback={handleSentenceModal} />
                    <Swiper
                        slidesPerView={padPerLine}
                        pagination={{ clickable: true }}
                        grid={{ fill: 'row', rows: 3 }}
                        spaceBetween={24}
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
                                          engWord={word.translation}
                                          sound={word.sound}
                                          category={word.category}
                                          callback={() => makeSentence(word.original, word.sound, word.id, word.category)}
                                      />
                                  </SwiperSlide>
                              ))
                            : allWords?.map((word) => (
                                  <SwiperSlide key={word.id} className={styles.swiperSlide}>
                                      <Pad
                                          id={word.id}
                                          word={word.original}
                                          engWord={word.translation}
                                          sound={word.sound}
                                          category={word.category}
                                          callback={() => makeSentence(word.original, word.sound, word.id, word.category)}
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
