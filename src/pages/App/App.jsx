import styles from './App.module.css';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Card from '../../components/Card/Card';
import { cards } from '../../mocks/cards';
import { useContext } from 'react';
import { SpeechContext } from '../../utils/Context/SpeechContext';
import { Howl } from 'howler';

const autoplay = (i, tracks) => {
    const sound = new Howl({
        src: [tracks[i]],
        preload: true,
        onend: function () {
            if ((i + 1) === tracks.length) {
                return;
            } else {
                autoplay(i + 1, tracks)
            }
        }
    })
    sound.play();
}

function App() {
    const { sentence, speech } = useContext(SpeechContext);


    return (
        <>
            <header className={styles.appHeader}>
                <h1 className={styles.headerH1}>Hello talk</h1>
            </header>
            <main className={styles.content}>
                <div className={styles.speechWrapper}>
                    <button className={styles.iconContainer}>
                        <BackspaceOutlinedIcon className="delete" />
                    </button>
                    <input type="text" name="speech" value={sentence} readOnly />
                    <button className={styles.iconContainer} onClick={() => autoplay(0, speech)}>
                        <RecordVoiceOverIcon className="play"/>
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
