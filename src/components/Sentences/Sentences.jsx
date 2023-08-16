import { useSentences } from '../../utils/hooks/useSentences';
import { deleteSentence } from '../../utils/Helpers/deleteSentence';
import { autoplay } from '../../utils/Helpers/autoplay';
import NoData from '../NoData/NoData';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './Sentences.module.css';

function Sentences() {
    const [sentences] = useSentences();

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
                <NoData text={"Oups ... Aucune phrase disponible."}/>
            )}
        </div>
    );
}

export default Sentences;
