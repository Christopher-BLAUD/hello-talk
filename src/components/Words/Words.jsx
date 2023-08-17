import { useWords } from '../../utils/hooks/useWords';
import { autoplay } from '../../utils/Helpers/autoplay';
import { db } from '../../utils/Helpers/db';
import { TransitionGroup } from 'react-transition-group';
import { Collapse } from '@mui/material';
import NoData from '../NoData/NoData';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './Words.module.css';

function Words() {
    const words = useWords();

    const playSound = (sound) => {
        if (typeof sound === 'string') autoplay(0, [sound]);
        if (typeof sound === 'object') {
            console.log(sound);
            const url = URL.createObjectURL(sound);
            autoplay(0, [url]);
        }
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
                        <TransitionGroup>
                            {words?.map((word) => (
                                <Collapse key={word.id}>
                                    <article className={styles.rows} id={word.id}>
                                        <span>{word.id}</span>
                                        <span>{word.original}</span>
                                        <span>{word.engTranslation}</span>
                                        <span>{word.category}</span>
                                        <span onClick={() => playSound(word.soundPath)}>
                                            <VolumeUpIcon className={styles.speakerIcon} />
                                        </span>
                                        <div className={styles.iconContainer} onClick={() => deleteWord(word.id)}>
                                            <CancelIcon className={styles.cancelIcon} />
                                        </div>
                                    </article>
                                </Collapse>
                            ))}
                        </TransitionGroup>
                    </div>
                </div>
            ) : (
                <NoData text={'Oups ... Aucun mot disponible.'} />
            )}
        </div>
    );
}

export default Words;
