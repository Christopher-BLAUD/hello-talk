import styles from './CounterCard.module.css';

function CounterCard(props) {
    let { title, count, icon, onClick, bg } = props;
    return (
        <article className={styles.cards} onClick={onClick}>
            <div className={styles.content}>
                <span className={styles.title}>{title}</span>
                <b className={styles.count}>{count}</b>
            </div>
            <div className={styles.iconContainer} style={{backgroundColor: bg}}>
                {icon}
            </div>
        </article>
    );
}

export default CounterCard;
