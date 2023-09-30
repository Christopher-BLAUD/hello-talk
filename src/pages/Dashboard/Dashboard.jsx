import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { Collapse, Zoom } from '@mui/material';
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
import Sentence from '../../controllers/sentences';
import SmallPad from '../../components/SmallPad/SmallPad';
import Alert from '../../components/Alert/Alert';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SendIcon from '@mui/icons-material/Send';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AbcIcon from '@mui/icons-material/Abc';
import SubjectIcon from '@mui/icons-material/Subject';
import AddWord from '../../components/AddWord/AddWord';
import AddCategory from '../../components/AddCategory/AddCategory';
import CounterCard from '../../components/CounterCard/CounterCard';
import logo from '../../assets/img/logo-gradient.svg';
import styles from './Dashboard.module.css';

function Dashboard() {
    const { setConnected, myController, setMyController, alert, setAlert, alertMess, alertType, words, setWords } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [openWordModal, setOpenWordModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newSentence, setNewSentence] = useState('');
    const [sentenceSounds, setSentenceSounds] = useState([]);
    const [sentences] = useSentences();
    const [lastSentences] = useSentences(4);
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
                setWords([]);
                navigate('/app');
            }
        } else {
            setConnected(true);
            setWords([]);
            navigate('/app');
        }
    };

    const findSentence = async (str) => {
        const result = await Sentence.findOne(str);
        return result.length !== 0 ? true : false;
    };

    const addSentence = async () => {
        if (newSentence === '') {
            createAlert(true, 'warning', "Aucune phrase n'est indiquée.");
        } else {
            const isSentenceExist = await findSentence(newSentence);

            if (!isSentenceExist) {
                const sentence = new Sentence(newSentence, sentenceSounds);
                await sentence.save();

                setNewSentence('');
                setSentenceSounds([]);
            } else {
                createAlert(true, 'warning', 'Cette phrase existe déja !');
            }
        }
    };

    const handleClick = () => setOpen(!open);
    const closeWordModal = () => setOpenWordModal(false);
    const closeCategoryModal = () => setOpenCategoryModal(false);

    const makeSentence = (word, sound) => {
        setNewSentence(formatSentence(newSentence, word));
        setSentenceSounds([...sentenceSounds, sound]);
    };

    const clearSentence = () => {
        setNewSentence('');
        setSentenceSounds([]);
    };

    const applyFilter = useCallback(
        (type) => {
            filtered.length > 0 ? setFiltered(setFilter(type, filtered)) : setWords(setFilter(type, words));

            setActiveFilter(type);
        },
        [setWords, filtered, words]
    );

    useEffect(() => {
        applyFilter(activeFilter, allWords);
        setWords(allWords);
    }, [activeFilter, allWords, applyFilter, setWords]);

    return (
        <ThemeProvider theme={dashboardTheme}>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>
                        <img src={logo} alt="logo de Marius System" /> Marius System
                    </h1>
                    <nav className={styles.navBar}>
                        <List component="ul" className={styles.listContainer}>
                            <ListItemButton component="li" className={styles.navItem} title="Application">
                                <Link
                                    to={'/app'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setWords([]);
                                        // connectToDevice();
                                        navigate('/app');
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
                                <ListItemText primary="Add items" className={styles.navText} />
                                {open ? <ExpandLess className={styles.navIcon} /> : <ExpandMore className={styles.navIcon} />}
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="ul">
                                    <ListItemButton component="li" className={styles.navItem} sx={{ pl: 4 }} title="Category">
                                        <Link onClick={() => setOpenCategoryModal(true)}>
                                            <div className={styles.dote}></div>
                                            <ListItemText primary="Category" className={styles.navText} />
                                        </Link>
                                    </ListItemButton>
                                    <ListItemButton component="li" className={styles.navItem} sx={{ pl: 4 }} title="Word">
                                        <Link onClick={() => setOpenWordModal(true)}>
                                            <div className={styles.dote}></div>
                                            <ListItemText primary="Word" className={styles.navText} />
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
                        <h2 className={styles.titleH2}>Dashboard</h2>
                        <section className={styles.globalInfos}>
                            <div className={styles.cardsContainer}>
                                <CounterCard
                                    onClick={() => navigate('')}
                                    title={'Words'}
                                    count={allWords?.length}
                                    bg={'#7d8cc41f'}
                                    icon={<AbcIcon sx={{ fill: '#7D8CC4' }} />}
                                />
                                <CounterCard
                                    onClick={() => navigate('categories')}
                                    title={'Categories'}
                                    count={categories?.length}
                                    bg={'#cb917326'}
                                    icon={<FormatListBulletedIcon sx={{ fill: '#CB9173' }} />}
                                />
                                <CounterCard
                                    onClick={() => navigate('sentences')}
                                    title={'Sentences'}
                                    count={sentences?.length}
                                    bg={'#7fc29b30'}
                                    icon={<SubjectIcon sx={{ fill: '#7FC29B' }} />}
                                />
                            </div>
                            <div className={styles.details}>
                                <Outlet context={[words, setWords]} />
                            </div>
                        </section>
                        <section className={styles.sentenceWrapper}>
                            <h3 className={styles.sentenceTitle}>Write a sentence</h3>
                            <div className={styles.sentenceContainer}>
                                <div className={styles.wordFinder}>
                                    <div className={styles.searchWrapper}>
                                        <div className={styles.inputContainer}>
                                            <input
                                                type="text"
                                                placeholder="Search for a word..."
                                                name="word-finder"
                                                autoComplete="off"
                                                onChange={(e) => setFiltered(searchWord(allWords, e.target.value))}
                                            />
                                            <SearchIcon className={styles.icon} />
                                        </div>
                                        {allWords?.length > 0 && (
                                            <div className={styles.filters}>
                                                <button onClick={() => applyFilter('id', allWords)} className={activeFilter === 'id' ? styles.activeFilter : undefined}>
                                                    ID
                                                </button>
                                                <button
                                                    onClick={() => applyFilter('alphabetical', allWords)}
                                                    className={activeFilter === 'alphabetical' ? styles.activeFilter : undefined}
                                                >
                                                    A-Z
                                                </button>
                                                <button
                                                    onClick={() => applyFilter('score', allWords)}
                                                    className={activeFilter === 'score' ? styles.activeFilter : undefined}
                                                >
                                                    Score
                                                </button>
                                                <button
                                                    onClick={() => applyFilter('category', allWords)}
                                                    className={activeFilter === 'category' ? styles.activeFilter : undefined}
                                                >
                                                    Categorie
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.smallCardsContainer}>
                                        {filtered?.length > 0
                                            ? filtered?.map((word) => (
                                                  <SmallPad
                                                      key={word.id}
                                                      id={word.id}
                                                      fr={word.original}
                                                      eng={word.translation}
                                                      color={word.category !== 'Récurrent' && setColorTheme(word.category, categories)}
                                                      callback={() => makeSentence(word.original, word.sound)}
                                                  />
                                              ))
                                            : words?.map((word) => (
                                                  <SmallPad
                                                      key={word.id}
                                                      id={word.id}
                                                      fr={word.original}
                                                      eng={word.translation}
                                                      color={word.category !== 'Récurrent' && setColorTheme(word.category, categories)}
                                                      callback={() => makeSentence(word.original, word.sound)}
                                                  />
                                              ))}
                                        {allWords?.length === 0 && <span>No word available at this time...</span>}
                                    </div>
                                </div>
                                <div className={styles.sentenceMaker}>
                                    <div className={styles.inputContainer}>
                                        <Tooltip arrow={true} TransitionComponent={Zoom} title="Clear selection">
                                            <BackspaceIcon className={styles.deleteIcon} onClick={clearSentence} />
                                        </Tooltip>
                                        <input type="text" placeholder="Your sentence ..." name="word-finder" defaultValue={newSentence} readOnly />
                                        <div className={styles.iconsWrapper}>
                                            <Tooltip arrow={true} TransitionComponent={Zoom} title="Save">
                                                <SendIcon className={styles.sendIcon} onClick={addSentence} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className={styles.lastItem}>
                                        <h4 className={styles.sentenceMakerTitle}>Last sentences</h4>
                                        <div className={styles.registered}>
                                            <TransitionGroup className={styles.transitionContainer}>
                                                {lastSentences?.map((item) => (
                                                    <Collapse key={item.id}>
                                                        <article key={item.id} className={styles.sentenceItem}>
                                                            <div className={styles.contentContainer}>
                                                                <Tooltip arrow={true} TransitionComponent={Zoom} title="Play sound">
                                                                    <VolumeUpIcon onClick={() => autoplay(0, item.sounds)} />
                                                                </Tooltip>
                                                                <span>{item.sentence}</span>
                                                            </div>
                                                            <Tooltip arrow={true} TransitionComponent={Zoom} title="Delete">
                                                                <CancelIcon className={styles.cancelIcon} onClick={() => deleteSentence(item.id)} />
                                                            </Tooltip>
                                                        </article>
                                                    </Collapse>
                                                ))}
                                            </TransitionGroup>
                                        </div>
                                        {lastSentences.length === 0 && <span className={styles.noData}>No sentences available.</span>}
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
