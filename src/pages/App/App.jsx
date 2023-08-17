import styles from './App.module.css';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AppsIcon from '@mui/icons-material/Apps';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import Pad from '../../components/Pad/Pad';
import Modal from '../../components/Modal/Modal';
import logo from '../../assets/img/logo-gradient.svg';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import { autoplay } from '../../utils/Helpers/autoplay';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/Helpers/db';

function App(props) {
    let { sentence, setSentence, speech, setSpeech, connected, myController, setMyController, currentTarget, setCurrentTarget, openModal, setOpenModal } =
        useContext(AppContext);
    const navigate = useNavigate();

    const words = useLiveQuery(async () => {
        return await db.words.where('recurrent').equals(0).toArray();
    });

    const reccurentsWords = useLiveQuery(async () => {
        return await db.words.where('recurrent').equals(1).limit(3).toArray();
    });

    const makeSentence = (word, sound) => {
        setSentence(sentence + ' ' + word);
        setSpeech([...speech, sound]);
    };

    const deleteSentence = () => {
        setSentence('');
        setSpeech([]);
    };

    const selectPad = (event) => {
        const { data } = event;
        const padData = data.getUint8(2);
        const targets = document.querySelectorAll('button.selectable');
        switch (padData) {
            case 32:
                setSentence('');
                setSpeech([]);
                break;
            case 16:
                if (!openModal) {
                    if (currentTarget === 1) setCurrentTarget((currentTarget = 6));
                    else if (currentTarget + 5 > targets.length - 1) setCurrentTarget((currentTarget = 0));
                    else setCurrentTarget((currentTarget += 5));
                } else {
                    currentTarget === targets.length - 1 ? setCurrentTarget((currentTarget = 0)) : setCurrentTarget((currentTarget += 1));
                }
                break;
            case 8:
                currentTarget >= targets.length - 1 ? setCurrentTarget((currentTarget = 0)) : setCurrentTarget((currentTarget += 1));
                break;
            case 4:
                targets[currentTarget].click();
                break;
            default:
                break;
        }
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
    }, [openModal]);

    return (
        <div className="wrapper">
            <header className={styles.appHeader}>
                <h1 className={styles.headerH1}>
                    <img src={logo} alt="logo de hello talk" /> Hello Talk
                </h1>
            </header>
            <main className={styles.content}>
                <Modal isOpen={openModal} onClose={handleClose} />
                <div className={styles.speechWrapper}>
                    <button className={styles.iconContainer} onClick={deleteSentence}>
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
                            permanent={true}
                            key={word.id}
                            id={word.id}
                            word={word.original}
                            engWord={word.engTranslation}
                            sound={word.soundPath}
                            callback={() => makeSentence(word.original, word.soundPath)}
                        />
                    ))}
                    <Pad outlined={true} icon={<AppsIcon />} word="Menu" callback={handleClickOpen} />
                    <Pad outlined={true} icon={<FormatAlignLeftIcon />} word="Liste" callback={() => navigate('/dashboard')} />
                    {words?.map((word) => (
                        <Pad
                            key={word.id}
                            id={word.id}
                            word={word.original}
                            engWord={word.engTranslation}
                            sound={word.soundPath}
                            callback={() => makeSentence(word.original, word.soundPath)}
                        />
                    ))}
                </div>
                {connected && (
                    <div className={styles.deviceStatus}>
                        <span>{myController.productName} est connecté</span>
                        <div className={styles.led}></div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
