import styles from './SmallPad.module.css';

function SmallPad(props) {
    let { id, fr, eng, callback, color } = props;
    return (
        <article className={styles.pad} onClick={callback}>
            <span className={styles.id}>{id}</span>
            <span className={styles.fr}>{fr}</span>
            <span className={styles.eng}>{eng}</span>
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_ii_261_1010)">
                    <path
                        d="M28 26V2.82843C28 1.04662 25.8457 0.154284 24.5858 1.41421L1.41421 24.5858C0.154284 25.8457 1.04662 28 2.82843 28H26C27.1046 28 28 27.1046 28 26Z"
                        fill={color}
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
                        colorInterpolationFilters='sRGB'
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
        </article>
    );
}

export default SmallPad;
