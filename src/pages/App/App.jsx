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
    let { sentence, setSentence, speech, setSpeech, setPaired, paired, setConnected, connected, myDevice } = useContext(SpeechContext);
    const deleteBtn = useRef();
    let [currentPad, setCurrentPad] = useState(0);
    const navigate = useNavigate();

    const setFocusPosition = (event) => {
        const buttons = document.querySelectorAll('button');
        const { data } = event;
        const pressedPad = data.getUint8(2);
        switch (pressedPad) {
            case 32:
                currentPad <= 0 ? setCurrentPad((currentPad = buttons.length - 1)) : setCurrentPad((currentPad -= 1));
                break;
            case 16:
                break;
            case 8:
                currentPad >= buttons.length - 1 ? setCurrentPad((currentPad = 0)) : setCurrentPad((currentPad += 1));
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
        try {
            await myDevice.open();
            myDevice.addEventListener('inputreport', (event) => setFocusPosition(event));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleDeviceData();
        // window.electronAPI.handleDeviceRemoved((event, value) => {
        //     if (value === 'removed') {
        //         setConnected(false);
        //         setPaired(false);
        //         navigate('/');
        //     }
        // });
    }, [paired, connected]);

    return (
        <>
            <header className={styles.appHeader}>
                <h1 className={styles.headerH1}>Hello talk <img src={logo} alt='logo de hello talk'/></h1>
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
            </main>
        </>
    );
}

export default App;
