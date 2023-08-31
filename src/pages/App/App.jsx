import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../utils/Context/AppContext';
import { Link } from 'react-router-dom';
import { autoplay } from '../../utils/Helpers/autoplay';
import { ThemeProvider } from '@emotion/react';
import { List, ListItemButton, ListItemIcon, ListItemText, createTheme } from '@mui/material';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Grid, Pagination } from 'swiper/modules';
import { words } from '../../mocks/words';
import axios from 'axios';
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
import * as FFT from 'fft-js';

function App(props) {
    let { speech, setSpeech, openCategoryModal, setOpenCategoryModal, openSentenceModal, setOpenSentenceModal } = useContext(AppContext);
    const [sentence, setSentence] = useState('');
    const [audio, setAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');
    const navigate = useNavigate();
    const [openPlan, setOpenPlan] = useState(false);
    const swiper = useSwiper();
    const swiperRef = useRef();
    const audioPlayer = useRef();
    const inputRef = useRef()

    const allWords = words.filter((word) => word.category !== 'Récurrent');
    const reccurentsWords = words.filter((word) => word.category === 'Récurrent');

    const makeSentence = (word, sound) => {
        setSentence(sentence + ' ' + word);
        setSpeech([...speech, sound]);
        inputRef.current.value += " " + word;
        inputRef.current.value.trim()
    };

    const clearSentence = () => {
        setSentence('');
        setSpeech([]);
        inputRef.current.value = ""
    };

    const sendSentence = async (sentence) => {
        const data = {
            text: sentence.trim() || inputRef.current.value
        };

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: '*/*'
            }
        };
        try {
            let response = await axios.post('http://localhost:8080/api/sentences', data, config);
            const buffer = response.data.sentence.data;

            const view = new Uint8Array(buffer);
            const blob = new Blob([view], { type: 'audio/mpeg-3' });

            const audioUrl = URL.createObjectURL(blob);
            const audioElement = new Audio(audioUrl);
            document.body.appendChild(audioElement);

            audioElement.play();
        } catch (error) {
            console.error(error);
        }
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
        setOpenPlan(false);
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
                        <img src={logo} alt="logo de hello talk" /> Hello talk
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
                                    <Link className={styles.navLink}>
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
                <PlanModal isOpen={openPlan} onClose={handleClose} />
                <div className={styles.speechWrapper}>
                    <button className={styles.iconContainer} onClick={clearSentence}>
                        <BackspaceOutlinedIcon className="delete" />
                    </button>
                    <input ref={inputRef} type="text" name="speech" />
                    <button className={`${styles.iconContainer} selectable`} onClick={() => sendSentence(sentence)}>
                        <RecordVoiceOverIcon className="play" />
                        <audio ref={audioPlayer} src={audioUrl}></audio>
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
                    <Pad outlined={true} icon={<FormatAlignLeftIcon />} word="Phrases" callback={handleSentenceModal} />
                    <Swiper
                        slidesPerView={5}
                        pagination={{ clickable: true }}
                        grid={{ fill: 'row', rows: 3 }}
                        spaceBetween={17}
                        modules={[Grid, Pagination]}
                        className={styles.mySwiper}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {allWords.map((word) => (
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
