import { useState } from 'react';
import { useWords } from '../../utils/hooks/useWords';
import ModifyWord from '../ModifyWord/ModifyWord';
import { autoplay } from '../../utils/Helpers/autoplay';
import { db } from '../../utils/Helpers/db';
import { TransitionGroup } from 'react-transition-group';
import { Collapse, Tooltip, Zoom } from '@mui/material';
import { setFilter } from '../../utils/Helpers/setFilter.js';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import NoData from '../NoData/NoData';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './Words.module.css';

export const searchWord = (array, search) => {
    return array.filter((word) => word.original.match(search));
};

function Words() {
    const allWords = useWords();
    const [word, setWord] = useState({});
    const [filteredWord, setFilteredWord] = useState([]);
    const [activeFilter, setActiveFilter] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = (word) => {
        setWord(word);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const deleteWord = async (wordId) => await db.words.delete(wordId);

    return (
        <div className={styles.wrapper}>
            <ModifyWord handleClose={handleClose} isOpen={open} word={word}/>
            <div className={styles.headingContainer}>
                <h3 className={styles.heading}>Mots enregistrés</h3>
                <div className={styles.searchWrapper}>
                    <div className={styles.filters}>
                        <button
                            onClick={() => {
                                setFilteredWord(setFilter('id', allWords));
                                setActiveFilter('id');
                            }}
                            className={activeFilter === 'id' ? styles.activeFilter : undefined}
                        >
                            ID
                        </button>
                        <button
                            onClick={() => {
                                setFilteredWord(setFilter('alphabetical', allWords));
                                setActiveFilter('alphabetical');
                            }}
                            className={activeFilter === 'alphabetical' ? styles.activeFilter : undefined}
                        >
                            Alphabétique
                        </button>
                        <button
                            onClick={() => {
                                setFilteredWord(setFilter('score', allWords));
                                setActiveFilter('score');
                            }}
                            className={activeFilter === 'score' ? styles.activeFilter : undefined}
                        >
                            Utilisation
                        </button>
                        <button
                            onClick={() => {
                                setFilteredWord(setFilter('category', allWords));
                                setActiveFilter('category');
                            }}
                            className={activeFilter === 'category' ? styles.activeFilter : undefined}
                        >
                            Catégorie
                        </button>
                    </div>
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
                                              <span>{word.translation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer}>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Modifier">
                                                      <EditNoteIcon className={styles.editIcon} onClick={() => handleClickOpen(word)} />
                                                  </Tooltip>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Supprimer">
                                                      <CancelIcon className={styles.cancelIcon} onClick={() => deleteWord(word.id)} />
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
                                              <span>{word.translation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer}>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Modifier">
                                                      <EditNoteIcon className={styles.editIcon} onClick={() => handleClickOpen(word)} />
                                                  </Tooltip>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Supprimer">
                                                      <CancelIcon className={styles.cancelIcon} onClick={() => deleteWord(word.id)} />
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
