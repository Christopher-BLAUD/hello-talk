import styles from './App.module.css';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Card from '../../components/Pad/Pad';
import { cards } from '../../mocks/cards';
import { useContext, useEffect, useState } from 'react';
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
    let { sentence, setSentence, speech, setSpeech, setPaired, setConnected } = useContext(SpeechContext);
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

    const getDeviceData = async () => {
        const devices = await navigator.hid.getDevices();
        if (devices.length > 0) {
            if (devices[0].vendorId === 1984 && devices[0].productId === 4410 && !devices[0].opened) {
                try {
                    let openingDevice = await devices[0].open();
                    devices[0].addEventListener('inputreport', (event) => setFocusPosition(event));
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    useEffect(() => {
        getDeviceData();
        // window.electronAPI.handleDeviceRemoved((event, value) => {
        //     if (value === 'removed') {
        //         setConnected(false);
        //         setPaired(false);
        //         navigate('/');
        //     }
        // });
    });

    return (
        <>
            <header className={styles.appHeader}>
                <h1 className={styles.headerH1}>Hello talk</h1>
            </header>
            <main className={styles.content}>
                <div className={styles.speechWrapper}>
                    <button
                        className={styles.iconContainer}
                        onClick={() => {
                            setSentence('');
                            setSpeech([]);
                        }}
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
