import { useWords } from '../../utils/hooks/useWords';
import { autoplay } from '../../utils/Helpers/autoplay';
import { db } from '../../utils/Helpers/db';
import { TransitionGroup } from 'react-transition-group';
import { Collapse, Tooltip, Zoom } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NoData from '../NoData/NoData';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './Words.module.css';
import { useState } from 'react';

export const searchWord = (array, search) => {
    return array.filter((word) => word.original.match(search));
};

function Words() {
    const allWords = useWords();
    const [filteredWord, setFilteredWord] = useState([]);

    const deleteWord = async (wordId) => {
        await db.words.delete(wordId);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.headingContainer}>
                <h3 className={styles.heading}>Mots enregistrés</h3>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Rechercher un mot ..."
                        name="word-finder"
                        autoComplete="off"
                        onChange={(e) => setFilteredWord(searchWord(allWords, e.target.value))}
                    />
                    <SearchIcon className={styles.icon} />
                </div>
            </div>
            {allWords?.length > 0 ? (
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <span>Son</span>
                        <span>Mot original</span>
                        <span>Traduction</span>
                        <span>Catégorie</span>
                    </div>
                    <div className={styles.listRows}>
                        <TransitionGroup component={'ul'}>
                            {filteredWord.length > 0
                                ? filteredWord?.map((word) => (
                                      <Collapse component={'li'} key={word.id} className={styles.rowsContainer}>
                                          <div className={styles.rows} id={word.id}>
                                              <span onClick={() => autoplay(0, [word.sound])}>
                                                  <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Écouter">
                                                      <VolumeUpIcon className={styles.speakerIcon} />
                                                  </Tooltip>
                                              </span>
                                              <span>{word.original}</span>
                                              <span>{word.engTranslation || word.translation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer} onClick={() => deleteWord(word.id)}>
                                                  <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Supprimer">
                                                      <CancelIcon className={styles.cancelIcon} />
                                                  </Tooltip>
                                              </div>
                                          </div>
                                      </Collapse>
                                  ))
                                : allWords?.map((word) => (
                                      <Collapse component={'li'} key={word.id} className={styles.rowsContainer}>
                                          <div className={styles.rows} id={word.id}>
                                              <span onClick={() => autoplay(0, [word.sound])}>
                                                  <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Écouter">
                                                      <VolumeUpIcon className={styles.speakerIcon} />
                                                  </Tooltip>
                                              </span>
                                              <span>{word.original}</span>
                                              <span>{word.engTranslation || word.translation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer} onClick={() => deleteWord(word.id)}>
                                                  <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Supprimer">
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
