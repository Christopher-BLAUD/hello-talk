import styles from './Sentences.module.css';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useSentences } from '../../utils/hooks/useSentences';
import { autoplay } from '../../utils/Helpers/autoplay';
import { db } from '../../utils/Helpers/db';

function Sentences() {
    const [sentences] = useSentences();

    const deleteSentence = async (sentenceId) => {
        return await db.sentences.delete(sentenceId);
    };

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.heading}>Phrases enregistrées</h3>
            {sentences?.length > 0 ? (
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <span>ID</span>
                        <span>Phrase</span>
                        <span>Son</span>
                    </div>
                    <div className={styles.listRows}>
                        {sentences?.map((item) => (
                            <article key={item.id} className={styles.rows}>
                                <span>{item.id}</span>
                                <span>{item.sentence}</span>
                                <span onClick={() => autoplay(0, item.sounds)}>
                                    <VolumeUpIcon className={styles.speakerIcon} />
                                </span>
                                <div className={styles.iconContainer} onClick={() => deleteSentence(item.id)}>
                                    <CancelIcon className={styles.cancelIcon} />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            ) : (
                <span>Oups ! Aucune phrase n'est enregistrée.</span>
            )}
        </div>
    );
}

export default Sentences;
