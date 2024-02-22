import { useContext } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import { useCategories } from '../../utils/hooks/useCategories';
import { setColorTheme } from '../../utils/helpers/setColorTheme';
import styles from './Pad.module.css';

function Pad(props) {
    const { id, word, engWord, sound, permanent = false, outlined = false, icon, category, callback } = props
    const { openCategoryModal, openSentenceModal } = useContext(AppContext);
    const categories = useCategories();

    return (
        <button
            className={`${styles.pad} ${permanent ? styles.permanent : outlined ? styles.outlined : ''} ${permanent ? 'recurrent' : ''} ${outlined ? 'options' : ''} ${
                !openCategoryModal && !openSentenceModal ? 'selectable' : ''
            }`}
            onClick={callback}
        >
            {id && <span className={styles.padId}>{id}</span>}
            <div className={styles.wordsContainer}>
                {icon ? (
                    <div className={styles.iconWrapper}>
                        {icon}
                        <span className={styles.french}>{word}</span>
                    </div>
                ) : (
                    <span className={styles.french}>{word}</span>
                )}
                {engWord && <span className={styles.english}>{engWord}</span>}
                {!outlined && !permanent && (
                    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_ii_261_1010)">
                            <path
                                d="M28 26V2.82843C28 1.04662 25.8457 0.154284 24.5858 1.41421L1.41421 24.5858C0.154284 25.8457 1.04662 28 2.82843 28H26C27.1046 28 28 27.1046 28 26Z"
                                fill={setColorTheme(category, categories)}
                            />
                        </g>
                        <defs>
                            <filter
                                id="filter0_ii_261_1010"
                                x="0.824219"
                                y="-1.17554"
                                width="30.1758"
                                height="33.1755"
                                filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB"
                            >
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_261_1010" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="3" dy="-2" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="effect1_innerShadow_261_1010" result="effect2_innerShadow_261_1010" />
                            </filter>
                        </defs>
                    </svg>
                )}
            </div>
        </button>
    );
}

export default Pad;
