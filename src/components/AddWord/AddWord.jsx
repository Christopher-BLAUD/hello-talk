import { useEffect, useRef, useState } from 'react';
import {
    createTheme,
    ThemeProvider,
    Button,
    Dialog,
    DialogTitle,
    FilledInput,
    InputAdornment,
    Icon,
    FormControl,
    InputLabel,
    Box,
    Select,
    MenuItem,
    FormControlLabel
} from '@mui/material';
import { IconFR, IconEN } from '../LangIcon/LangIcon';
import DownloadIcon from '@mui/icons-material/Download';
import MicIcon from '@mui/icons-material/Mic';
import styles from './AddWord.module.css';
import { modalTheme } from '../../utils/Theme/Modal/modalTheme';
import { db } from '../../utils/helpers/db';
import { Checkbox } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCategories } from '../../utils/hooks/useCategories';

function AddWord(props) {
    const { onClose, isOpen } = props;
    const [original, setOriginal] = useState('');
    const [engTranslation, setEngTranslation] = useState('');
    const [recurrentWord, setRecurrentWord] = useState(0);
    const [category, setCategory] = useState('');
    const [file, setFile] = useState([]);
    const categories = useCategories();
    const inputFile = useRef();

    const handleClose = () => {
        onClose(isOpen);
    };

    const handleWord = (event) => {
        setOriginal(event.target.value);
    };

    const handleTranslation = (event) => {
        setEngTranslation(event.target.value);
    };

    const handleCategory = (event) => {
        setCategory(event.target.value);
    };

    const handleRecurrent = (event) => {
        event.target.checked === true ? setRecurrentWord(1) : setRecurrentWord(0);
    };

    const handleFile = (event) => {
        setFile(event.target.files[0]);
    };

    const sendFile = (sourcePath) => {
        window.electronAPI.moveFile(sourcePath);
    };

    const addNewWord = async (word) => {
        let soundPath = './sounds/' + file.name;

        if (original !== '' && engTranslation !== '' && category !== '' && file.name !== undefined) {
            const query = await db.words.add({
                original: original,
                engTranslation: engTranslation,
                soundPath: soundPath,
                recurrent: recurrentWord
            });
            sendFile(file.path);
        } else {
            alert("Veuillez remplir l'ensemble des informations");
        }
    };

    return (
        <ThemeProvider theme={modalTheme}>
            <Dialog onClose={handleClose} open={isOpen}>
                <Box sx={{ padding: '32px', borderBottom: '1px solid var(--blue-dark)', backgroundColor: 'var(--blue)' }}>
                    <DialogTitle sx={{ fontFamily: 'DM sans', fontWeight: '500!important', fontSize: '20px' }}>Enregistrer un mot</DialogTitle>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '32px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 className={styles.containerHeading}>Renseignez le mot</h3>
                        <FormControl>
                            <InputLabel htmlFor="word-original">Mot original</InputLabel>
                            <FilledInput
                                id="word-original"
                                type="text"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Icon className={styles.iconContainer}>
                                            <IconFR />
                                        </Icon>
                                    </InputAdornment>
                                }
                                label="Mot original"
                                onChange={handleWord}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="word-original">Traduction</InputLabel>
                            <FilledInput
                                id="word-original"
                                type="text"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Icon>
                                            <IconEN />
                                        </Icon>
                                    </InputAdornment>
                                }
                                label="Traduction"
                                onChange={handleTranslation}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
                            <Select label="Catégorie" onChange={handleCategory} value={category} required>
                                {categories?.map((category) => (
                                    <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormControlLabel control={<Checkbox />} label="Mot récurrent ?" onClick={handleRecurrent} required />
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 className={styles.containerHeading}>Choisissez un son</h3>
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                            <FormControl>
                                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => inputFile.current.click()}>
                                    Télécharger un fichier
                                </Button>
                                <input ref={inputFile} type="file" name="sound" id="sound" className={styles.inputFile} onChange={handleFile} />
                            </FormControl>
                            <FormControl>
                                <Button
                                    variant="outlined"
                                    startIcon={<MicIcon />}
                                    sx={{ backgroundColor: 'rgba(252, 222, 156, 0.13)', color: '#FDEDC9' }}
                                >
                                    Enregistrer ma voix
                                </Button>
                            </FormControl>
                        </Box>
                        <span className={styles.fileName}>{file.name}</span>
                        <FormControl>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: 'var(--green-succes)',
                                    border: 'none',
                                    padding: '16px',
                                    color: 'var(--blue-dark)',
                                    textTransform: 'uppercase',
                                    fontWeight: '700',
                                    letterSpacing: '1px',
                                    marginTop: '16px',
                                    boxShadow: '0px 7px 13px -4px var(--blue);',
                                    '&:hover': {
                                        backgroundColor: 'var(--green-succes)'
                                    }
                                }}
                                onClick={addNewWord}
                            >
                                Enregistrer
                            </Button>
                        </FormControl>
                    </Box>
                </Box>
            </Dialog>
        </ThemeProvider>
    );
}

export default AddWord;
