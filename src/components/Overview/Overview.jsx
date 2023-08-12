import styles from './Overview.module.css';
import { useState } from 'react';
import CounterCard from '../CounterCard/CounterCard';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SendIcon from '@mui/icons-material/Send';
import SmallPad from '../SmallPad/SmallPad';
import { pads } from '../../mocks/cards';
import { autoplay } from '../../utils/helpers/autoplay';
import { useCategories } from '../../utils/hooks/useCategories';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/helpers/db';

function Overview() {
    const [sentence, setSentence] = useState('');
    const [speech, setSpeech] = useState([]);
    const categories = useCategories()

    const words = useLiveQuery(async () => {
        return await db.words.toArray();
    });

    const makeSentence = (word, sound) => {
        setSentence(sentence + ' ' + word);
        setSpeech([...speech, sound]);
    };

    const deleteSentence = () => {
        setSentence('');
        setSpeech([]);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titleH2}>Tableau de bord</h2>
            <section className={styles.globalInfos}>
                <div className={styles.cardsContainer}>
                    <CounterCard title={'Catégories'} count={categories?.length} />
                    <CounterCard title={'Mots enregistrés'} count={words?.length} />
                    <CounterCard title={'Phrases enregistrées'} count={29} />
                </div>
                <div className={styles.details}></div>
            </section>
            <section className={styles.sentenceWrapper}>
                <h3 className={styles.sentenceTitle}>Rédiger une phrase</h3>
                <div className={styles.sentenceContainer}>
                    <div className={styles.wordFinder}>
                        <div className={styles.inputContainer}>
                            <input type="text" placeholder="Rechercher un mot ..." name="word-finder" />
                            <SearchIcon className={styles.icon} />
                        </div>
                        <div className={styles.smallCardsContainer}>
                            {pads.map((card) => (
                                <SmallPad key={card.id} id={card.id} fr={card.fr} eng={card.eng} callback={() => makeSentence(card.fr, card.sound)} />
                            ))}
                        </div>
                    </div>
                    <div className={styles.sentenceMaker}>
                        <div className={styles.inputContainer}>
                            <input type="text" placeholder="Votre phrase" name="word-finder" defaultValue={sentence} readOnly />
                            <div className={styles.iconsWrapper}>
                                <BackspaceIcon onClick={deleteSentence} />
                                <VolumeUpIcon onClick={() => autoplay(0, speech)} />
                                <SendIcon className={styles.sendIcon} />
                            </div>
                        </div>
                        <div className={styles.content}>
                            <h4 className={styles.sentenceMakerTitle}>Dernières phrases enregistrées</h4>
                            <div className={styles.registered}>
                                <div className={styles.sentenceItem}>
                                    <div className={styles.contentContainer}>
                                        <VolumeUpIcon />
                                        <span>bonjour mon nom est marius</span>
                                    </div>
                                    <CancelIcon className={styles.cancelIcon} />
                                </div>
                                <div className={styles.sentenceItem}>
                                    <div className={styles.contentContainer}>
                                        <VolumeUpIcon />
                                        <span>bonjour mon nom est marius</span>
                                    </div>
                                    <CancelIcon className={styles.cancelIcon} />
                                </div>
                                <div className={styles.sentenceItem}>
                                    <div className={styles.contentContainer}>
                                        <VolumeUpIcon />
                                        <span>bonjour mon nom est marius</span>
                                    </div>
                                    <CancelIcon className={styles.cancelIcon} />
                                </div>
                                <div className={styles.sentenceItem}>
                                    <div className={styles.contentContainer}>
                                        <VolumeUpIcon />
                                        <span>bonjour mon nom est marius</span>
                                    </div>
                                    <CancelIcon className={styles.cancelIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Overview;
