import styles from './SmallPad.module.css'

function SmallPad(props) {
    let { id, fr, eng } = props
    return (
        <article className={styles.pad}>
            <span className={styles.id}>{id}</span>
            <span className={styles.fr}>{fr}</span>
            <span className={styles.eng}>{eng}</span>
        </article>
    )
}

export default SmallPad;