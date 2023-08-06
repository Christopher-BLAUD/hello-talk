import { useContext } from 'react';
import { SpeechContext } from '../../utils/Context/SpeechContext';
import styles from './Pad.module.css';

function Pad({ id, word, engWord, sound, permanent = false, outlined = false, icon, callback }) {
    const { openModal} = useContext(SpeechContext);

    return (
        <button
            className={`${styles.pad} ${permanent ? styles.permanent : outlined ? styles.outlined : ''} ${!openModal ? "selectable" : ""}`}
            onClick={callback}
        >
            {id && <span className={styles.padId}>{id}</span>}
            <div className={styles.wordsContainer}>
                {icon ? (
                    <div className={styles.iconWrapper}>
                        {icon}
                        <span className={styles.french}>{word}</span>
                    </div>
                ) : (
                    <span className={styles.french}>{word}</span>
                )}
                {engWord && <span className={styles.english}>{engWord}</span>}
            </div>
        </button>
    );
}

export default Pad;
