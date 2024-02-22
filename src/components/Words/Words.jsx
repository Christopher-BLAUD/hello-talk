import { useCallback, useEffect, useState } from 'react';
import { useWords } from '../../utils/hooks/useWords';
import { autoplay } from '../../utils/helpers/autoplay';
import { TransitionGroup } from 'react-transition-group';
import { Collapse, Tooltip, Zoom } from '@mui/material';
import { setFilter } from '../../utils/helpers/setFilter.js';
import Word from '../../controllers/words';
import ModifyWord from '../ModifyWord/ModifyWord';
import NoData from '../NoData/NoData';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './Words.module.css';

export const searchWord = (array, search) => {
    return array.filter((word) => word.original.match(search));
};

function Words() {
    const [allWords, setWords] = useWords();
    const [word, setWord] = useState({});
    const [filteredWord, setFilteredWord] = useState([]);
    const [activeFilter, setActiveFilter] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = (word) => {
        setWord(word);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const deleteWord = async (wordId) => await Word.delete(wordId);

    const applyFilter = useCallback(
        (type) => {
            filteredWord.length > 0 ? setFilteredWord(setFilter(type, filteredWord)) : setWords(setFilter(type, allWords));
            setActiveFilter(type);
        },
        [setWords, allWords, filteredWord]
    );

    useEffect(() => {
        applyFilter(activeFilter, allWords);
    }, [activeFilter, allWords, applyFilter, filteredWord]);

    return (
        <div className={styles.wrapper}>
            <ModifyWord handleClose={handleClose} isOpen={open} word={word} />
            <div className={styles.headingContainer}>
                <h3 className={styles.heading}>Words</h3>
                <div className={styles.searchWrapper}>
                    <div className={styles.filters}>
                        <button onClick={() => applyFilter('id')} className={activeFilter === 'id' ? styles.activeFilter : undefined}>
                            ID
                        </button>
                        <button onClick={() => applyFilter('alphabetical')} className={activeFilter === 'alphabetical' ? styles.activeFilter : undefined}>
                            A-Z
                        </button>
                        <button onClick={() => applyFilter('score')} className={activeFilter === 'score' ? styles.activeFilter : undefined}>
                            Score
                        </button>
                        <button onClick={() => applyFilter('category')} className={activeFilter === 'category' ? styles.activeFilter : undefined}>
                            Categorie
                        </button>
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            placeholder="Search for a word ..."
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
                        <span>Sound</span>
                        <span>Original</span>
                        <span>Translation</span>
                        <span>Categorie</span>
                    </div>
                    <div className={styles.listRows}>
                        <TransitionGroup component={'ul'}>
                            {filteredWord.length > 0
                                ? filteredWord?.map((word) => (
                                      <Collapse component={'li'} key={word.id} className={styles.rowsContainer}>
                                          <div className={styles.rows} id={word.id}>
                                              <span onClick={() => autoplay(0, [word.sound])}>
                                                  <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Play sound">
                                                      <VolumeUpIcon className={styles.speakerIcon} />
                                                  </Tooltip>
                                              </span>
                                              <span>{word.original}</span>
                                              <span>{word.translation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer}>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Edit">
                                                      <EditNoteIcon className={styles.editIcon} onClick={() => handleClickOpen(word)} />
                                                  </Tooltip>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Delete">
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
                                                  <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Play sound">
                                                      <VolumeUpIcon className={styles.speakerIcon} />
                                                  </Tooltip>
                                              </span>
                                              <span>{word.original}</span>
                                              <span>{word.translation}</span>
                                              <span>{word.category}</span>
                                              <div className={styles.iconContainer}>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Edit">
                                                      <EditNoteIcon className={styles.editIcon} onClick={() => handleClickOpen(word)} />
                                                  </Tooltip>
                                                  <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Delete">
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
                <NoData text={'Oops... No words available.'} />
            )}
        </div>
    );
}

export default Words;
