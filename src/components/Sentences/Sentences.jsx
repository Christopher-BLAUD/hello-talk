import { useSentences } from '../../utils/hooks/useSentences';
import { deleteSentence } from '../../utils/Helpers/deleteSentence';
import { autoplay } from '../../utils/Helpers/autoplay';
import { setFilter } from '../../utils/Helpers/setFilter';
import { Tooltip, Zoom } from '@mui/material';
import { useState } from 'react';
import NoData from '../NoData/NoData';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './Sentences.module.css';

export const searchSentence = (array, search) => {
    if (search === '') return [];
    else return array.filter((sentence) => sentence.sentence.match(search));
};

function Sentences() {
    const [sentences] = useSentences();
    const [filtered, setFiltered] = useState([]);
    const [activeFilter, setActiveFilter] = useState('');

    return (
        <div className={styles.wrapper}>
            <div className={styles.headingContainer}>
                <h3 className={styles.heading}>Sentences</h3>
                <div className={styles.searchWrapper}>
                    <div className={styles.filters}>
                        <button
                            onClick={() => {
                                setFiltered(setFilter('id', sentences));
                                setActiveFilter('id');
                            }}
                            className={activeFilter === 'id' ? styles.activeFilter : undefined}
                        >
                            ID
                        </button>
                        <button
                            onClick={() => {
                                setFiltered(setFilter('alphabetical', sentences));
                                setActiveFilter('alphabetical');
                            }}
                            className={activeFilter === 'alphabetical' ? styles.activeFilter : undefined}
                        >
                            A-Z
                        </button>
                        <button
                            onClick={() => {
                                setFiltered(setFilter('score', sentences));
                                setActiveFilter('score');
                            }}
                            className={activeFilter === 'score' ? styles.activeFilter : undefined}
                        >
                            Score
                        </button>
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            placeholder="Search for a word ..."
                            name="word-finder"
                            autoComplete="off"
                            onChange={(e) => setFiltered(searchSentence(sentences, e.target.value))}
                        />
                        <SearchIcon className={styles.icon} />
                    </div>
                </div>
            </div>
            {sentences?.length > 0 ? (
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <span>Sound</span>
                        <span>Sentence</span>
                    </div>
                    <div className={styles.listRows}>
                        {filtered.length > 0
                            ? filtered?.map((item) => (
                                  <article key={item.id} className={styles.rows}>
                                      <span onClick={() => autoplay(0, item.sounds)}>
                                          <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Play sound">
                                              <VolumeUpIcon className={styles.speakerIcon} />
                                          </Tooltip>
                                      </span>
                                      <span>{item.sentence}</span>
                                      <div className={styles.iconContainer} onClick={() => deleteSentence(item.id)}>
                                          <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Delete">
                                              <CancelIcon className={styles.cancelIcon} />
                                          </Tooltip>
                                      </div>
                                  </article>
                              ))
                            : sentences?.map((item) => (
                                  <article key={item.id} className={styles.rows}>
                                      <span onClick={() => autoplay(0, item.sounds)}>
                                          <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Play sound">
                                              <VolumeUpIcon className={styles.speakerIcon} />
                                          </Tooltip>
                                      </span>
                                      <span>{item.sentence}</span>
                                      <div className={styles.iconContainer} onClick={() => deleteSentence(item.id)}>
                                          <Tooltip placement="left" arrow={true} TransitionComponent={Zoom} title="Delete">
                                              <CancelIcon className={styles.cancelIcon} />
                                          </Tooltip>
                                      </div>
                                  </article>
                              ))}
                    </div>
                </div>
            ) : (
                <NoData text={'Oops... No sentences available.'} />
            )}
        </div>
    );
}

export default Sentences;
