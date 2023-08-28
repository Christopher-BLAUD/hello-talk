import { useContext, useRef, useState } from 'react';
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
        openCategoryModal,
        setOpenCategoryModal,
        openSentenceModal,
        setOpenSentenceModal,
        words
    } = useContext(AppContext);
    const navigate = useNavigate()
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
   

    const handleCategoryModal = () => {
        setOpenCategoryModal(true);
    };

    const handleSentenceModal = () => {
        setOpenSentenceModal(true);
    };

    const handleClose = () => {
        setOpenCategoryModal(false);
        setOpenSentenceModal(false);
        setOpenPlan(false)
    };


    return (
        <div className={styles.wrapper}>
            <header className={styles.appHeader}>
                <div className={styles.headerContainer}>
                        <div className={styles.deviceStatus}>
                            <div className={styles.led}></div>
                            <span>Jabbla Woodpecker 2 est connecté</span>
                        </div>
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
                        slidesPerView={5}
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
