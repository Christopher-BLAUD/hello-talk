import styles from './Overview.module.css';
import CounterCard from '../CounterCard/CounterCard';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CancelIcon from '@mui/icons-material/Cancel';
import SmallPad from '../SmallPad/SmallPad';
import { pads } from '../../mocks/cards';

function Overview() {
    return (
        <div className={styles.container}>
            <h2 className={styles.titleH2}>Tableau de bord</h2>
            <section className={styles.globalInfos}>
                <div className={styles.cardsContainer}>
                    <CounterCard title={'Catégories'} count={3} />
                    <CounterCard title={'Mots enregistrés'} count={147} />
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
                            <SearchIcon />
                        </div>
                        <div className={styles.smallCardsContainer}>
                            {pads.map((card) => (
                                <SmallPad id={card.id} fr={card.fr} eng={card.eng} />
                            ))}
                        </div>
                    </div>
                    <div className={styles.sentenceMaker}>
                        <div className={styles.inputContainer}>
                            <input type="text" placeholder="Votre phrase" name="word-finder" />
                            <SearchIcon />
                        </div>
                        <div className={styles.content}>
                            <h4 className={styles.sentenceMakerTitle}>Dernières phrases enregistrées</h4>
                            <div className={styles.registered}>
                                <div className={styles.sentenceItem}>
                                    <div className={styles.contentContainer}>
                                        <VolumeUpIcon />
                                        <span>bonjour mon nom est marius</span>
                                    </div>
                                    <CancelIcon className={styles.cancelIcon}/>
                                </div>
                                <div className={styles.sentenceItem}>
                                    <div className={styles.contentContainer}>
                                        <VolumeUpIcon />
                                        <span>bonjour mon nom est marius</span>
                                    </div>
                                    <CancelIcon className={styles.cancelIcon}/>
                                </div>
                                <div className={styles.sentenceItem}>
                                    <div className={styles.contentContainer}>
                                        <VolumeUpIcon />
                                        <span>bonjour mon nom est marius</span>
                                    </div>
                                    <CancelIcon className={styles.cancelIcon}/>
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
