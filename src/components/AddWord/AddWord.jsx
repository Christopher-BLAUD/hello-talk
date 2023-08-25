import { useEffect, useRef, useState } from 'react';
import { useCategories } from '../../utils/hooks/useCategories';
import { useAlert } from '../../utils/hooks/useAlert';
import {
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
    FormControlLabel,
    Switch
} from '@mui/material';
import { modalTheme } from '../../utils/Theme/Modal/modalTheme';
import { db } from '../../utils/Helpers/db';
import { IconFR, IconEN } from '../LangIcon/LangIcon';
import DownloadIcon from '@mui/icons-material/Download';
import MicIcon from '@mui/icons-material/Mic';
import Visualizer from '../Visualizer/Visualizer';
import styles from './AddWord.module.css';

function AddWord(props) {
    const { onClose, isOpen } = props;
    const [original, setOriginal] = useState('');
    const [engTranslation, setEngTranslation] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState([]);
    const [stream, setStream] = useState(null);
    const [permission, setPermission] = useState(false);
    const [mimeType, setMimeType] = useState('audio/mpeg-3');
    const [recordingStatus, setRecordingStatus] = useState('inactive');
    const [audio, setAudio] = useState(null);
    const mediaRecorder = useRef(null);
    const inputFile = useRef(null);
    const audioPlayer = useRef(null);
    const categories = useCategories();
    const createAlert = useAlert();

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

    const handleFile = (event) => {
        if (event.target.files[0].type === 'audio/mpeg') {
            setFile(event.target.files[0]);
        } else {
            createAlert(true, 'error', 'Seul les fichiers .mp3 sont acceptés !');
        }
    };

    const sendFile = (source) => {
        window.electronAPI.moveFile(source);
    };

    const addNewWord = async (word) => {
        let soundPath;
        if (original !== '' && engTranslation !== '' && category !== '' && file.length !== 0) {
            if (file.name && file.type === 'audio/mpeg') {
                soundPath = './sounds/' + file.name;
                // sendFile(file.path);
            }
            if (file.type === 'audio/mpeg-3') {
                soundPath = file;
            }
            await db.words.add({
                original: original,
                engTranslation: engTranslation,
                category: category,
                sound: soundPath
            });
            createAlert(true, 'success', 'Mot enregistré avec succès !');
            setOriginal('');
            setEngTranslation('');
            setCategory('');
            setFile([]);
        } else {
            createAlert(true, 'error', "Veuillez remplir l'ensemble des informations");
        }
    };

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

            console.log(audioPlayer.current);
        };
    };

    useEffect(() => {
        getMicPermission();
    }, []);

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
                                value={original}
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
                                value={engTranslation}
                                onChange={handleTranslation}
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
                            <Select label="Catégorie" onChange={handleCategory} value={category} required>
                                <MenuItem  value="Récurrent">
                                    Récurrent
                                </MenuItem>
                                {categories?.map((category) => (
                                    <MenuItem key={category.id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 className={styles.containerHeading}>Choisissez un son</h3>
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
