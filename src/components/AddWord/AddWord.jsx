import { TextField, FormGroup } from '@mui/material';
import styles from './AddWord.module.css'

function AddWord() {
    return (
        <section className={styles.wrapper}>
            <h2 className="titleH2">Ajouter un mot</h2>
            <FormGroup className={styles.form}>
                <TextField id="outlined-basic" label="Français" variant="outlined" color='success'/>
            </FormGroup>
        </section>
    );
}

export default AddWord;
