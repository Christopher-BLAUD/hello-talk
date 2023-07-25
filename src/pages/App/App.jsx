import styles from './App.module.css';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Card from '../../components/Pad/Pad';
import logo from '../../assets/img/logo-gradient.svg';
import { cards } from '../../mocks/cards';
import { useContext, useEffect, useRef, useState } from 'react';
import { SpeechContext } from '../../utils/Context/SpeechContext';
import { Howl } from 'howler';
import { useNavigate } from 'react-router-dom';

const autoplay = (i, tracks) => {
    const sound = new Howl({
        src: [tracks[i]],
        preload: true,
        onend: function () {
            if (i + 1 === tracks.length) {
                return;
            } else {
                autoplay(i + 1, tracks);
            }
        }
    });
    sound.play();
};

function App() {
    let { sentence, setSentence, speech, setSpeech, connected, setConnected, myDevice } = useContext(SpeechContext);
    const deleteBtn = useRef();
    let [currentPad, setCurrentPad] = useState(0);
    const navigate = useNavigate();

    const setFocusPosition = (event) => {
        const buttons = document.querySelectorAll('button');
        const { data } = event;
        const pressedPad = data.getUint8(2);
        switch (pressedPad) {
            case 32:
                setSentence('');
                setSpeech([]);
                break;
            case 16:
                currentPad === 1
                    ? setCurrentPad((currentPad = 6))
                    : currentPad + 5 > buttons.length - 1
                    ? setCurrentPad((currentPad = 1))
                    : setCurrentPad((currentPad += 5));
                break;
            case 8:
                currentPad >= buttons.length - 1 ? setCurrentPad((currentPad = 1)) : setCurrentPad((currentPad += 1));
                break;
            case 4:
                buttons[currentPad].click();
                break;
            default:
                break;
        }
        buttons[currentPad].focus();
    };

    const handleDeviceData = async () => {
        if (!myDevice.vendorId) {
            const devices = await navigator.hid.getDevices();
            try {
                await devices[0].open();
                devices[0].addEventListener('inputreport', (event) => setFocusPosition(event));
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await myDevice.open();
                myDevice.addEventListener('inputreport', (event) => setFocusPosition(event));
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        handleDeviceData();
        // window.electronAPI.handleDeviceRemoved((event, value) => {
        //     if (value === 'removed') {
        //         setConnected(false);
        //         navigate('/');
        //     }
        // });
    }, []);

    return (
        <>
            <header className={styles.appHeader}>
                <h1 className={styles.headerH1}>
                    Hello Talk <img src={logo} alt="logo de hello talk" />
                </h1>
            </header>
            <main className={styles.content}>
                <div className={styles.speechWrapper}>
                    <button
                        className={styles.iconContainer}
                        onClick={() => {
                            setSentence('');
                            setSpeech([]);
                        }}
                        ref={deleteBtn}
                    >
                        <BackspaceOutlinedIcon className="delete" />
                    </button>
                    <input type="text" name="speech" value={sentence} readOnly tabIndex={-1} />
                    <button className={styles.iconContainer} onClick={() => autoplay(0, speech)}>
                        <RecordVoiceOverIcon className="play" />
                    </button>
                </div>
                <div className={styles.cardsContainer}>
                    {cards.map((card) => (
                        <Card key={card.id} id={card.id} frWord={card.fr} engWord={card.eng} sound={card.sound} />
                    ))}
                </div>
                {connected && (
                    <div className={styles.deviceStatus}>
                        <span>{myDevice.productName} est connecté</span>
                        <div className={styles.led}></div>
                    </div>
                )}
            </main>
        </>
    );
}

export default App;
