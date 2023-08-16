import { useContext, useState } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import { useCategories } from '../../utils/hooks/useCategories';
import { modalTheme } from '../../utils/Theme/Modal/modalTheme';
import { db } from '../../utils/Helpers/db';
import { formatName } from '../../utils/Helpers/formatName';
import { validator } from '../../utils/Helpers/validator';
import {
    ThemeProvider,
    List,
    ListItem,
    Dialog,
    DialogTitle,
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    Icon,
    Button,
    Box,
    ListItemText,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import styles from './AddCategory.module.css';

function AddCategory(props) {
    const { onClose, isOpen } = props;
    const { setAlert, setAlertMess, setAlertType } = useContext(AppContext);
    const [category, setCategory] = useState('');
    const categories = useCategories();

    const handleClose = () => {
        onClose(isOpen);
    };

    const addCategory = async () => {
        if (category !== '') {
            const query = await db.categories.add({
                name: category
            });
            setAlert(true);
            setAlertMess('Catégorie créée avec succès !');
            setAlertType('success');
            setCategory('');
        } else {
            setAlert(true);
            setAlertMess('Veuillez saisir un nom de catégorie');
            setAlertType('error');
        }
    };

    const handleCategory = (event) => {
        event.target.value = formatName(event.target.value);
        if (validator('word', event.target.value)) {
            setCategory(event.target.value);
        } else {
            setAlert(true);
            setAlertMess('Ce champ ne doit contenir que des lettres !');
            setAlertType('warning');
        }
    };

    return (
        <ThemeProvider theme={modalTheme}>
            <Dialog onClose={handleClose} open={isOpen}>
                <Box sx={{ padding: '32px', borderBottom: '1px solid var(--blue-dark)', backgroundColor: 'var(--blue)' }}>
                    <DialogTitle sx={{ fontFamily: 'DM sans', fontWeight: '500!important', fontSize: '20px' }}>Enregistrer une catégorie</DialogTitle>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 className={styles.containerHeading}>{categories?.length === 0 ? 'Aucune catégorie enregistée.' : 'Catégories disponibles'}</h3>
                        <List
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                paddingTop: '16px',
                                paddingBottom: '32px',
                                maxHeight: '224px',
                                overflowY: 'auto'
                            }}
                        >
                            {categories?.map((category) => (
                                <ListItem key={category.id}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderOutlinedIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={category.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
                        <FormControl>
                            <InputLabel htmlFor="word-original">Nouvelle catégorie</InputLabel>
                            <FilledInput
                                id="word-original"
                                type="text"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon>
                                            <CreateNewFolderOutlinedIcon />
                                        </Icon>
                                    </InputAdornment>
                                }
                                label="Nouvelle catégorie"
                                sx={{ '& input': { padding: '16px', fontWeight: '400' } }}
                                onChange={handleCategory}
                                value={category}
                            />
                        </FormControl>
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
                                    boxShadow: '0px 7px 13px -4px var(--blue);',
                                    '&:hover': {
                                        backgroundColor: 'var(--green-succes)'
                                    }
                                }}
                                onClick={addCategory}
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

export default AddCategory;
