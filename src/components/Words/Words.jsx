import { useWords } from '../../utils/hooks/useWords';
import { autoplay } from '../../utils/Helpers/autoplay';
import { db } from '../../utils/Helpers/db';
import { TransitionGroup } from 'react-transition-group';
import { Collapse, Tooltip, Zoom } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NoData from '../NoData/NoData';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useSearch } from '../../utils/hooks/useSearch';
import styles from './Words.module.css';

function Words() {
    const words = useWords();
    const [result, setSearch] = useSearch('word');

    const deleteWord = async (wordId) => {
        return await db.words.delete(wordId);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.headingContainer}>
                <h3 className={styles.heading}>Mots enregistrés</h3>
                <div className={styles.inputContainer}>
                    <input type="text" placeholder="Rechercher un mot ..." name="word-finder" autoComplete="off" onChange={(e) => setSearch(e.target.value)} />
                    <SearchIcon className={styles.icon} />
                </div>
            </div>
            {words?.length > 0 ? (
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <span>Son</span>
                        <span>Mot original</span>
                        <span>Traduction</span>
                        <span>Catégorie</span>
                    </div>
                    <div className={styles.listRows}>
                        <TransitionGroup component={'ul'}>
                            {result.length > 0
                                ? result?.map((word) => (
                                      <Collapse component={'li'} key={word.id} className={styles.rowsContainer}>
                                          <div className={styles.rows} id={word.id}>
                                              <span onClick={() => autoplay(0, [word.sound])}>
                                                  <VolumeUpIcon className={styles.speakerIcon} />
                                              </span>
                                              <span>{word.original}</span>
                                              <span>{word.engTranslation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer} onClick={() => deleteWord(word.id)}>
                                                  <CancelIcon className={styles.cancelIcon} />
                                              </div>
                                          </div>
                                      </Collapse>
                                  ))
                                : words?.map((word) => (
                                      <Collapse component={'li'} key={word.id} className={styles.rowsContainer}>
                                          <div className={styles.rows} id={word.id}>
                                              <span onClick={() => autoplay(0, [word.sound])}>
                                                  <Tooltip placement='left' arrow={true} TransitionComponent={Zoom} title="Écouter">
                                                      <VolumeUpIcon className={styles.speakerIcon} />
                                                  </Tooltip>
                                              </span>
                                              <span>{word.original}</span>
                                              <span>{word.engTranslation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer} onClick={() => deleteWord(word.id)}>
                                              <Tooltip placement='left' arrow={true} TransitionComponent={Zoom} title="Supprimer">
                                                  <CancelIcon className={styles.cancelIcon} />
                                                </Tooltip>
                                              </div>
                                          </div>
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
