import { useContext } from 'react';
import { SpeechContext } from '../../utils/Context/SpeechContext';
import styles from './Card.module.css';

function Card({ id, frWord, engWord, sound }) {
    const { sentence, setSentence, speech, setSpeech } = useContext(SpeechContext);

    return (
        <a href="#" className={styles.card} onClick={() => {
            setSentence(sentence + " " + frWord);
            setSpeech([...speech, sound])
        }}>
            <span className={styles.cardId}>{id}</span>
            <div className={styles.wordsContainer}>
                <span className={styles.french}>{frWord}</span>
                <span className={styles.english}>{engWord}</span>
            </div>
        </a>
    );
}

export default Card;
