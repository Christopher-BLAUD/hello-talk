import { Link, useNavigate, Outlet } from 'react-router-dom';
import { AppContext } from '../../utils/Context/AppContext';
import { useCategories } from '../../utils/hooks/useCategories';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/Helpers/db';
import { useContext, useEffect, useState } from 'react';
import { autoplay } from '../../utils/Helpers/autoplay';
import { ThemeProvider, createTheme } from '@mui/material';
import { useSentences } from '../../utils/hooks/useSentences';
import { getLastSentences } from '../../utils/Helpers/getLastSentences';
import SmallPad from '../../components/SmallPad/SmallPad';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import AddWord from '../../components/AddWord/AddWord';
import AddCategory from '../../components/AddCategory/AddCategory';
import CounterCard from '../../components/CounterCard/CounterCard';
import Words from '../../components/Words/Words';
import logo from '../../assets/img/logo-gradient.svg';
import styles from './Dashboard.module.css';

function Dashboard() {
    const { words, setWords, setConnected, myController, setMyController } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [openWordModal, setOpenWordModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newSentence, setNewSentence] = useState('');
    const [sentenceSounds, setSentenceSounds] = useState([]);
    const [search, setSearch] = useState([]);
    const categories = useCategories();
    const [sentences, setSentences] = useSentences();
    const navigate = useNavigate();


    const connectToDevice = async () => {
        if(myController.vendorId === undefined) {
            const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 1984, productId: 4410 }] });
            if (devices.length > 0) {
                setConnected(true);
                setMyController(devices[0]);
                navigate('/app');
            }
        } else {
            navigate('/app');
        }
    };

    const wordSearch = async (e) => {
        setSearch(await db.words.where('original').startsWith(e.target.value).toArray());
    };

    const wordsQuery = useLiveQuery(async () => {
        setWords(await db.words.orderBy('id').toArray());
    });

    const addSentence = async () => {
        const query = await db.sentences.add({
            sentence: newSentence,
            sounds: sentenceSounds
        });

        setNewSentence("")
        setSentenceSounds([])
    };

    const selectedTheme = createTheme({
        components: {
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
                            backgroundColor: '#fcde9c36',
                            borderRight: '2px solid #fcde9c'
                        },
                        '&.Mui-selected:hover': {
                            backgroundColor: '#fcde9c36',
                            borderRight: '2px solid #fcde9c'
                        },
                        '&.Mui-selected .MuiTypography-root': {
                            color: '#fcde9c'
                        },
                        '&.Mui-selected .MuiSvgIcon-root': {
                            fill: '#fcde9c'
                        }
                    }
                }
            }
        }
    });

    const handleClick = () => {
        setOpen(!open);
    };

    const closeWordModal = () => {
        setOpenWordModal(false);
    };

    const closeCategoryModal = () => {
        setOpenCategoryModal(false);
    };

    const setSelected = (path) => {
        return path === window.location.hash ? true : false;
    };

    const makeSentence = (word, sound) => {
        setNewSentence(newSentence + ' ' + word);
        setSentenceSounds([...sentenceSounds, sound]);
    };

    const clearSentence = () => {
        setNewSentence('');
        setSentenceSounds([]);
    };

    useEffect(() => {
        if (sentences.length > 4) setSentences(getLastSentences(sentences, 4))
    }, [sentences])

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>
                    <img src={logo} alt="logo de Marius System" /> Marius System
                </h1>
                <nav className={styles.navBar}>
                    <List className={styles.listContainer}>
                        <ThemeProvider theme={selectedTheme}>
                            <ListItemButton className={styles.navItem} selected={setSelected('#/app')} title="Application">
                                <Link to={'/app'} onClick={(e) => {
                                    e.preventDefault()
                                    connectToDevice()
                                }}>
                                    <ListItemIcon className={styles.iconContainer}>
                                        <AppsOutlinedIcon className={styles.navIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary="Application" className={styles.navText} />
                                </Link>
                            </ListItemButton>
                            <ListItemButton className={`${styles.navItem} ${styles.subMenuHeading}`} onClick={handleClick} title="Ajouter un élément">
                                <ListItemIcon className={styles.iconContainer}>
                                    <AddCircleOutlineOutlinedIcon className={styles.navIcon} />
                                </ListItemIcon>
                                <ListItemText primary="Ajouter un élement" className={styles.navText} />
                                {open ? <ExpandLess className={styles.navIcon} /> : <ExpandMore className={styles.navIcon} />}
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="ul">
                                    <ListItemButton className={styles.navItem} sx={{ pl: 4, marginLeft: '16px' }} title="Ajouter une catégorie">
                                        <Link onClick={() => setOpenCategoryModal(true)}>
                                            <ListItemIcon className={styles.iconContainer}>
                                                <CreateNewFolderOutlinedIcon className={styles.navIcon} />
                                            </ListItemIcon>
                                            <ListItemText primary="Nouvelle catégorie" className={styles.navText} />
                                        </Link>
                                    </ListItemButton>
                                    <ListItemButton className={styles.navItem} sx={{ pl: 4, marginLeft: '16px' }} title="Ajouter un mot">
                                        <Link onClick={() => setOpenWordModal(true)}>
                                            <ListItemIcon className={styles.iconContainer}>
                                                <DriveFileRenameOutlineIcon className={styles.navIcon} />
                                            </ListItemIcon>
                                            <ListItemText primary="Nouveau mot" className={styles.navText} />
                                        </Link>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </ThemeProvider>
                    </List>
                </nav>
            </header>
            <main className={styles.content}>
                <AddWord onClose={closeWordModal} isOpen={openWordModal} />
                <AddCategory onClose={closeCategoryModal} isOpen={openCategoryModal} />
                <div className={styles.container}>
                    <h2 className={styles.titleH2}>Tableau de bord</h2>
                    <section className={styles.globalInfos}>
                        <div className={styles.cardsContainer}>
                            <CounterCard onClick={() => navigate('categories')} title={'Catégories'} count={categories?.length} />
                            <CounterCard onClick={() => navigate('words')} title={'Mots enregistrés'} count={words?.length} />
                            <CounterCard onClick={() => navigate('sentences')} title={'Phrases enregistrées'} count={sentences?.length} />
                        </div>
                        <div className={styles.details}>{window.location.hash === '#/dashboard' ? <Words /> : <Outlet />}</div>
                    </section>
                    <section className={styles.sentenceWrapper}>
                        <h3 className={styles.sentenceTitle}>Rédiger une phrase</h3>
                        <div className={styles.sentenceContainer}>
                            <div className={styles.wordFinder}>
                                <div className={styles.inputContainer}>
                                    <input type="text" placeholder="Rechercher un mot ..." name="word-finder" onChange={wordSearch} />
                                    <SearchIcon className={styles.icon} />
                                </div>
                                <div className={styles.smallCardsContainer}>
                                    {search.length > 0
                                        ? search?.map((word) => (
                                              <SmallPad
                                                  key={word.id}
                                                  id={word.id}
                                                  fr={word.original}
                                                  eng={word.engTranslation}
                                                  callback={() => makeSentence(word.original, word.soundPath)}
                                              />
                                          ))
                                        : words?.map((word) => (
                                              <SmallPad
                                                  key={word.id}
                                                  id={word.id}
                                                  fr={word.original}
                                                  eng={word.engTranslation}
                                                  callback={() => makeSentence(word.original, word.soundPath)}
                                              />
                                          ))}
                                </div>
                            </div>
                            <div className={styles.sentenceMaker}>
                                <div className={styles.inputContainer}>
                                    <BackspaceIcon className={styles.deleteIcon} onClick={clearSentence} />
                                    <input type="text" placeholder="Votre phrase ..." name="word-finder" defaultValue={newSentence} readOnly />
                                    <div className={styles.iconsWrapper}>
                                        <VolumeUpIcon onClick={() => autoplay(0, sentenceSounds)} />
                                        <SendIcon className={styles.sendIcon} onClick={addSentence} />
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <h4 className={styles.sentenceMakerTitle}>Dernières phrases enregistrées</h4>
                                    <div className={styles.registered}>
                                        {sentences?.map((item) => (
                                            <div key={item.id} className={styles.sentenceItem}>
                                                <div className={styles.contentContainer}>
                                                    <VolumeUpIcon onClick={() => autoplay(0, item.sounds)} />
                                                    <span>{item.sentence}</span>
                                                </div>
                                                <CancelIcon className={styles.cancelIcon} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
