import styles from './CounterCard.module.css';

function CounterCard(props) {
    let { title, count, onClick } = props;
    return (
        <article className={styles.cards} onClick={onClick}>
            <div className={styles.content}>
                <span className={styles.title}>{title}</span>
                <b className={styles.count}>{count}</b>
            </div>
        </article>
    );
}

export default CounterCard;
