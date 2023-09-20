import { useContext, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { AppContext } from '../../utils/Context/AppContext';
import { useCategories } from '../../utils/hooks/useCategories';
import { useSentences } from '../../utils/hooks/useSentences';
import { useAlert } from '../../utils/hooks/useAlert';
import { db } from '../../utils/Helpers/db';
import { autoplay } from '../../utils/Helpers/autoplay';
import { setFilter } from '../../utils/Helpers/setFilter';
import { setColorTheme } from '../../utils/Helpers/setColorTheme';
import { searchWord } from '../../components/Words/Words';
import { deleteSentence } from '../../utils/Helpers/deleteSentence';
import { formatSentence } from '../../utils/Helpers/formatSentence';
import { ThemeProvider, Tooltip } from '@mui/material';
import { dashboardTheme } from '../../utils/Theme/Dashboard/dashboardTheme';
import { useSearch } from '../../utils/hooks/useSearch';
import { useLiveQuery } from 'dexie-react-hooks';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import SmallPad from '../../components/SmallPad/SmallPad';
import Alert from '../../components/Alert/Alert';
import Zoom from '@mui/material/Zoom';
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
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AbcIcon from '@mui/icons-material/Abc';
import SubjectIcon from '@mui/icons-material/Subject';
import Collapse from '@mui/material/Collapse';
import AddWord from '../../components/AddWord/AddWord';
import AddCategory from '../../components/AddCategory/AddCategory';
import CounterCard from '../../components/CounterCard/CounterCard';
import logo from '../../assets/img/logo-gradient.svg';
import styles from './Dashboard.module.css';
import Word from '../../controllers/words';

function Dashboard() {
    const { setConnected, myController, setMyController, alert, setAlert, alertMess, alertType, words, setWords } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [openWordModal, setOpenWordModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newSentence, setNewSentence] = useState('');
    const [sentenceSounds, setSentenceSounds] = useState([]);
    const [sentences] = useSentences();
    const [lastSentences] = useSentences(4);
    const [result] = useSearch('word');
    const [filtered, setFiltered] = useState([]);
    const [activeFilter, setActiveFilter] = useState('');
    const createAlert = useAlert();
    const categories = useCategories();
    const allWords = useLiveQuery(async () => await db.words.orderBy('id').toArray());
    const navigate = useNavigate();

    const connectToDevice = async () => {
        if (myController.vendorId === undefined) {
            const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 1984, productId: 4410 }] });
            if (devices.length > 0) {
                setConnected(true);
                setMyController(devices[0]);
                navigate('/app');
            }
        } else {
            setConnected(true);
            navigate('/app');
        }
    };

    const findSentence = async (str) => {
        const result = await db.sentences.where('sentence').equals(str).toArray();
        return result.length !== 0 ? true : false;
    };

    const addSentence = async () => {
        if (newSentence === '') {
            createAlert(true, 'warning', "Aucune phrase n'est indiquée.");
        } else {
            const isSentenceExist = await findSentence(newSentence);
            if (!isSentenceExist) {
                await db.sentences.add({
                    sentence: newSentence,
                    sounds: sentenceSounds
                });
                setNewSentence('');
                setSentenceSounds([]);
            } else {
                createAlert(true, 'warning', 'Cette phrase existe déja !');
            }
        }
    };

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
        setNewSentence(formatSentence(newSentence, word));
        setSentenceSounds([...sentenceSounds, sound]);
    };

    const clearSentence = () => {
        setNewSentence('');
        setSentenceSounds([]);
    };

    return (
        <ThemeProvider theme={dashboardTheme}>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>
                        <img src={logo} alt="logo de Marius System" /> Marius System
                    </h1>
                    <nav className={styles.navBar}>
                        <List component="ul" className={styles.listContainer}>
                            <ListItemButton component="li" className={styles.navItem} selected={setSelected('#/app')} title="Application">
                                <Link
                                    to={'/app'}
                                    onClick={(e) => {
                                        // e.preventDefault();
                                        // connectToDevice();
                                    }}
                                >
                                    <ListItemIcon className={styles.iconContainer}>
                                        <AppsOutlinedIcon className={styles.navIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary="Application" className={styles.navText} />
                                </Link>
                            </ListItemButton>
                            <ListItemButton component="li" className={styles.navItem} sx={{ padding: '16px 24px' }} onClick={handleClick} title="Ajouter un élément">
                                <ListItemIcon className={styles.iconContainer}>
                                    <AddCircleOutlineOutlinedIcon className={styles.navIcon} />
                                </ListItemIcon>
                                <ListItemText primary="Ajouter un élement" className={styles.navText} />
                                {open ? <ExpandLess className={styles.navIcon} /> : <ExpandMore className={styles.navIcon} />}
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="ul">
                                    <ListItemButton component="li" className={styles.navItem} sx={{ pl: 4 }} title="Ajouter une catégorie">
                                        <Link onClick={() => setOpenCategoryModal(true)}>
                                            <ListItemIcon className={styles.iconContainer}>
                                                <CreateNewFolderOutlinedIcon className={styles.navIcon} />
                                            </ListItemIcon>
                                            <ListItemText primary="Nouvelle catégorie" className={styles.navText} />
                                        </Link>
                                    </ListItemButton>
                                    <ListItemButton component="li" className={styles.navItem} sx={{ pl: 4 }} title="Ajouter un mot">
                                        <Link onClick={() => setOpenWordModal(true)}>
                                            <ListItemIcon className={styles.iconContainer}>
                                                <DriveFileRenameOutlineIcon className={styles.navIcon} />
                                            </ListItemIcon>
                                            <ListItemText primary="Nouveau mot" className={styles.navText} />
                                        </Link>
                                    </ListItemButton>
                                </List>
                            </Collapse>
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
                                <CounterCard
                                    onClick={() => navigate('')}
                                    title={'Mots enregistrés'}
                                    count={allWords?.length}
                                    icon={<AbcIcon sx={{ fill: '#7D8CC4' }} />}
                                />
                                <CounterCard
                                    onClick={() => navigate('categories')}
                                    title={'Catégories'}
                                    count={categories?.length}
                                    icon={<FormatListBulletedIcon sx={{ fill: '#CB9173' }} />}
                                />
                                <CounterCard
                                    onClick={() => navigate('sentences')}
                                    title={'Phrases enregistrées'}
                                    count={sentences?.length}
                                    icon={<SubjectIcon sx={{ fill: '#7FC29B' }} />}
                                />
                            </div>
                            <div className={styles.details}>
                                <Outlet context={[words, setWords]} />
                            </div>
                        </section>
                        <section className={styles.sentenceWrapper}>
                            <h3 className={styles.sentenceTitle}>Rédiger une phrase</h3>
                            <div className={styles.sentenceContainer}>
                                <div className={styles.wordFinder}>
                                    <div className={styles.searchWrapper}>
                                        <div className={styles.inputContainer}>
                                            <input
                                                type="text"
                                                placeholder="Rechercher un mot ..."
                                                name="word-finder"
                                                autoComplete="off"
                                                onChange={(e) => setFiltered(searchWord(allWords, e.target.value))}
                                            />
                                            <SearchIcon className={styles.icon} />
                                        </div>
                                        <div className={styles.filters}>
                                            <button
                                                onClick={() => {
                                                    setFiltered(setFilter('id', allWords));
                                                    setActiveFilter('id');
                                                }}
                                                className={activeFilter === 'id' ? styles.activeFilter : undefined}
                                            >
                                                ID
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFiltered(setFilter('alphabetical', allWords));
                                                    setActiveFilter('alphabetical');
                                                }}
                                                className={activeFilter === 'alphabetical' ? styles.activeFilter : undefined}
                                            >
                                                Alphabétique
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFiltered(setFilter('score', allWords));
                                                    setActiveFilter('score');
                                                }}
                                                className={activeFilter === 'score' ? styles.activeFilter : undefined}
                                            >
                                                Utilisation
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFiltered(setFilter('category', allWords));
                                                    setActiveFilter('category');
                                                }}
                                                className={activeFilter === 'category' ? styles.activeFilter : undefined}
                                            >
                                                Catégorie
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.smallCardsContainer}>
                                        {filtered?.length > 0
                                            ? filtered?.map((word) => (
                                                  <SmallPad
                                                      key={word.id}
                                                      id={word.id}
                                                      fr={word.original}
                                                      eng={word.translation}
                                                      color={setColorTheme(word.category, categories)}
                                                      callback={() => makeSentence(word.original, word.sound)}
                                                  />
                                              ))
                                            : allWords?.map((word) => (
                                                  <SmallPad
                                                      key={word.id}
                                                      id={word.id}
                                                      fr={word.original}
                                                      eng={word.translation}
                                                      color={setColorTheme(word.category, categories)}
                                                      callback={() => makeSentence(word.original, word.sound)}
                                                  />
                                              ))}
                                        {result?.length === 0 && allWords?.length === 0 && <span>Aucun mot disponible pour le moment ...</span>}
                                    </div>
                                </div>
                                <div className={styles.sentenceMaker}>
                                    <div className={styles.inputContainer}>
                                        <Tooltip arrow={true} TransitionComponent={Zoom} title="Effacer la sélection">
                                            <BackspaceIcon className={styles.deleteIcon} onClick={clearSentence} />
                                        </Tooltip>
                                        <input type="text" placeholder="Votre phrase ..." name="word-finder" defaultValue={newSentence} readOnly />
                                        <div className={styles.iconsWrapper}>
                                            <Tooltip arrow={true} TransitionComponent={Zoom} title="Enregistrer">
                                                <SendIcon className={styles.sendIcon} onClick={addSentence} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className={styles.lastItem}>
                                        <h4 className={styles.sentenceMakerTitle}>Dernières phrases enregistrées</h4>
                                        <div className={styles.registered}>
                                            <TransitionGroup className={styles.transitionContainer}>
                                                {lastSentences?.map((item) => (
                                                    <Collapse key={item.id}>
                                                        <article key={item.id} className={styles.sentenceItem}>
                                                            <div className={styles.contentContainer}>
                                                                <Tooltip arrow={true} TransitionComponent={Zoom} title="Écouter">
                                                                    <VolumeUpIcon onClick={() => autoplay(0, item.sounds)} />
                                                                </Tooltip>
                                                                <span>{item.sentence}</span>
                                                            </div>
                                                            <Tooltip arrow={true} TransitionComponent={Zoom} title="Supprimer">
                                                                <CancelIcon className={styles.cancelIcon} onClick={() => deleteSentence(item.id)} />
                                                            </Tooltip>
                                                        </article>
                                                    </Collapse>
                                                ))}
                                            </TransitionGroup>
                                        </div>
                                        {lastSentences.length === 0 && <span className={styles.noData}>Aucune phrase disponible.</span>}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
                <Alert type={alertType} text={alertMess} alert={alert} onClick={() => setAlert(false)} />
            </div>
        </ThemeProvider>
    );
}

export default Dashboard;
