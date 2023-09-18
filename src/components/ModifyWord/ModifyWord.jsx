import { useState, useRef, useEffect } from 'react';
import { useAlert } from '../../utils/hooks/useAlert';
import { useCategories } from '../../utils/hooks/useCategories';
import { sendFile } from '../../utils/Helpers/sendFile';
import { ThemeProvider, Button, Dialog, DialogTitle, FilledInput, InputAdornment, Icon, FormControl, InputLabel, Box, Select, MenuItem } from '@mui/material';
import { modalTheme } from '../../utils/Theme/Modal/modalTheme';
import { IconFR, IconEN } from '../LangIcon/LangIcon';
import Word from '../../controllers/words';
import DownloadIcon from '@mui/icons-material/Download';
import MicIcon from '@mui/icons-material/Mic';
import Visualizer from '../Visualizer/Visualizer';
import styles from './ModifyWord.module.css';

function ModifyWord(props) {
    let { handleClose, isOpen, word } = props;
    const [recordingStatus, setRecordingStatus] = useState('inactive');
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [mimeType, setMimeType] = useState('audio/mpeg');
    const [file, setFile] = useState([]);
    const [audio, setAudio] = useState(null);
    const [original, setOriginal] = useState('');
    const [translation, setTranslation] = useState('');
    const [category, setCategory] = useState('');
    const inputFile = useRef(null);
    const mediaRecorder = useRef(null);
    const audioPlayer = useRef(null);
    const categories = useCategories();
    const createAlert = useAlert();

    const getMicPermission = async () => {
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: false });
            setPermission(true);
            setStream(streamData);
        } catch (error) {
            alert(error.message);
        }
    };

    const startRecording = async () => {
        setRecordingStatus('recording');
        const media = new MediaRecorder(stream, { type: mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localAudioChunks = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setFile(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus('inactive');
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(file, { type: mimeType });
            setFile(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            audioPlayer.current.controls = true;
            audioPlayer.current.autoplay = true;
        };
    };

    const handleFile = (event) => {
        if (event.target.files[0].type === 'audio/mpeg') {
            setFile(event.target.files[0]);
        } else {
            createAlert(true, 'error', 'Seul les fichiers .mp3 sont acceptés !');
        }
    };

    const clearData = () => {
        setOriginal('');
        setTranslation('');
        setCategory('');
        setFile([]);
    };

    const saveChanging = async (wordID) => {
        let sound;

        if (original !== '' || translation !== '' || category !== '' || file.length !== 0) {
            if (file.name && file.type === 'audio/mpeg') {
                sound = './sounds/' + file.name;
                sendFile(file.path);
            }
            if (file.type === 'audio/mpeg') {
                sound = file;
            }

            let changes = { original, translation, category, sound };
            const dataArray = Object.entries(changes);

            for (let [key, value] of dataArray) {
                if (value === '' || value === undefined) delete changes[key];
            }

            try {
                await Word.update(wordID, changes);
                createAlert(true, 'success', 'Modifications enregistrées avec succés !');
                clearData();

                word = { ...word, ...changes };

                console.log(word);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.log(word);
            createAlert(true, 'warning', "Aucune modification n'a été saisie");
        }
    };

    useEffect(() => {
        getMicPermission();
    }, [word]);

    return (
        <ThemeProvider theme={modalTheme}>
            <Dialog open={isOpen} onClose={handleClose}>
                <Box sx={{ padding: '32px', borderBottom: '1px solid var(--blue-dark)', backgroundColor: 'var(--blue)' }}>
                    <DialogTitle>Modifier un mot</DialogTitle>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <FormControl>
                            <InputLabel htmlFor="word-original">Mot original</InputLabel>
                            <FilledInput
                                id="word-original"
                                type="text"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Icon>
                                            <IconFR />
                                        </Icon>
                                    </InputAdornment>
                                }
                                label="Mot original"
                                defaultValue={word.original}
                                onChange={(e) => setOriginal(e.target.value)}
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
                                defaultValue={word.translation || word.engTranslation}
                                onChange={(e) => setTranslation(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
                            <Select label="Catégorie" defaultValue={word.category} onChange={(e) => setCategory(e.target.value)} required>
                                <MenuItem value="Récurrent">Récurrent</MenuItem>
                                {categories?.map((category) => (
                                    <MenuItem key={category.id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 className={styles.containerHeading}>Modifier le son</h3>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', width: '100%' }}>
                                {recordingStatus === 'inactive' && (
                                    <FormControl sx={{ width: '100%' }}>
                                        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => inputFile.current.click()}>
                                            Télécharger un fichier
                                        </Button>
                                    </FormControl>
                                )}
                                <input ref={inputFile} type="file" name="sound" id="sound" className={styles.inputFile} onChange={handleFile} />
                                <FormControl sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    {permission && recordingStatus === 'inactive' && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<MicIcon />}
                                            sx={{
                                                backgroundColor: '#e3e3e814',
                                                color: 'var(--grey-light)',
                                                borderColor: 'var(--grey-light)',
                                                '&:hover': {
                                                    backgroundColor: '#e9e9ea24'
                                                }
                                            }}
                                            onClick={startRecording}
                                        >
                                            Enregistrer ma voix
                                        </Button>
                                    )}
                                    {recordingStatus === 'recording' && (
                                        <Button
                                            startIcon={<Visualizer />}
                                            variant="container"
                                            onClick={stopRecording}
                                            sx={{
                                                border: '1px solid var(--grey-light)',
                                                color: 'var(--grey-light)',
                                                width: 'fit-content',
                                                '& .MuiButton-startIcon': {
                                                    marginRight: '16px'
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#e9e9ea24'
                                                }
                                            }}
                                        >
                                            Arrêter l'enregistrement
                                        </Button>
                                    )}
                                </FormControl>
                            </Box>
                            {!file.name && <audio ref={audioPlayer} src={audio}></audio>}
                            <span className={styles.fileName}>{file.name}</span>
                        </Box>
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
                                onClick={() => saveChanging(word.id, {})}
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

export default ModifyWord;
