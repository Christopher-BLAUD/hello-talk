import { useSentences } from '../../utils/hooks/useSentences';
import { deleteSentence } from '../../utils/Helpers/deleteSentence';
import { autoplay } from '../../utils/Helpers/autoplay';
import { useSearch } from '../../utils/hooks/useSearch';
import NoData from '../NoData/NoData';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './Sentences.module.css';
import { Tooltip, Zoom } from '@mui/material';

function Sentences() {
    const [sentences] = useSentences();
    const [result, setSearch] = useSearch('sentence');

    return (
        <div className={styles.wrapper}>
            <div className={styles.headingContainer}>
                <h3 className={styles.heading}>Phrases enregistrées</h3>
                <div className={styles.inputContainer}>
                    <input type="text" placeholder="Rechercher un mot ..." name="word-finder" autoComplete="off" onChange={(e) => setSearch(e.target.value)} />
                    <SearchIcon className={styles.icon} />
                </div>
            </div>
            {sentences?.length > 0 ? (
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <span>Son</span>
                        <span>Phrase</span>
                    </div>
                    <div className={styles.listRows}>
                        {result.length > 0
                            ? result?.map((item) => (
                                  <article key={item.id} className={styles.rows}>
                                      <span onClick={() => autoplay(0, item.sounds)}>
                                          <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Écouter">
                                              <VolumeUpIcon className={styles.speakerIcon} />
                                          </Tooltip>
                                      </span>
                                      <span>{item.sentence}</span>
                                      <div className={styles.iconContainer} onClick={() => deleteSentence(item.id)}>
                                          <Tooltip placement='left' arrow={true} TransitionComponent={Zoom} title="Supprimer">
                                              <CancelIcon className={styles.cancelIcon} />
                                          </Tooltip>
                                      </div>
                                  </article>
                              ))
                            : sentences?.map((item) => (
                                  <article key={item.id} className={styles.rows}>
                                      <span onClick={() => autoplay(0, item.sounds)}>
                                          <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Écouter">
                                              <VolumeUpIcon className={styles.speakerIcon} />
                                          </Tooltip>
                                      </span>
                                      <span>{item.sentence}</span>
                                      <div className={styles.iconContainer} onClick={() => deleteSentence(item.id)}>
                                          <Tooltip placement='left' arrow={true} TransitionComponent={Zoom} title="Supprimer">
                                              <CancelIcon className={styles.cancelIcon} />
                                          </Tooltip>
                                      </div>
                                  </article>
                              ))}
                    </div>
                </div>
            ) : (
                <NoData text={'Oups ... Aucune phrase disponible.'} />
            )}
        </div>
    );
}

export default Sentences;
