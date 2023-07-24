import { useContext } from 'react';
import { SpeechContext } from '../../utils/Context/SpeechContext';
import styles from './Pad.module.css';

function Pad({ id, frWord, engWord, sound }) {
    const { sentence, setSentence, speech, setSpeech } = useContext(SpeechContext);

    return (
        <button
            className={styles.pad}
            onClick={() => {
                setSentence(sentence + ' ' + frWord);
                setSpeech([...speech, sound]);
            }}
        >
            <span className={styles.padId}>{id}</span>
            <div className={styles.wordsContainer}>
                <span className={styles.french}>{frWord}</span>
                <span className={styles.english}>{engWord}</span>
            </div>
        </button>
    );
}

export default Pad;
