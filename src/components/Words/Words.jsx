import { useWords } from '../../utils/hooks/useWords';
import { autoplay } from '../../utils/Helpers/autoplay';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './Words.module.css';
import { db } from '../../utils/Helpers/db';
import { useState } from 'react';

function Words() {
    const words = useWords();
    const [speech, setSpeech] = useState([]);

    const playSound = (word) => {
        setSpeech(word.sound);
        autoplay(0, speech);
    };

    const deleteWord = async (wordId) => {
        return await db.words.delete(wordId);
    };

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.heading}>Mots enregistrés</h3>
            {words.length > 0 ? (
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <span>ID</span>
                        <span>Mot original</span>
                        <span>Traduction</span>
                        <span>Catégorie</span>
                        <span>Son</span>
                    </div>
                    <div className={styles.listRows}>
                        {words?.map((word) => (
                            <article key={word.id} className={styles.rows} id={word.id}>
                                <span>{word.id}</span>
                                <span>{word.original}</span>
                                <span>{word.engTranslation}</span>
                                <span>{word.category}</span>
                                <span onClick={playSound}>
                                    <VolumeUpIcon className={styles.speakerIcon} />
                                </span>
                                <div className={styles.iconContainer} onClick={() => deleteWord(word.id)}>
                                    <CancelIcon className={styles.cancelIcon} />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            ) : (
                <span>Oups ! Aucun mot n'est enregistré.</span>
            )}
        </div>
    );
}

export default Words;
