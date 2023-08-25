import { useContext } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import styles from './Pad.module.css';

function Pad({ id, word, engWord, sound, permanent = false, outlined = false, icon, callback }) {
    const { openCategoryModal, openSentenceModal } = useContext(AppContext);

    return (
        <button
            className={`${styles.pad} ${permanent ? styles.permanent : outlined ? styles.outlined : ''} ${permanent ? 'recurrent' : ''} ${outlined ? 'options' : ''} ${
                !openCategoryModal && !openSentenceModal ? 'selectable' : ''
            }`}
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
