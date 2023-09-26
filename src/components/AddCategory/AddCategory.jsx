import { useState } from 'react';
import { useCategories } from '../../utils/hooks/useCategories';
import { useAlert } from '../../utils/hooks/useAlert';
import Category from '../../controllers/categories';
import { modalTheme } from '../../utils/Theme/Modal/modalTheme';
import { formatName } from '../../utils/Helpers/formatName';
import { MuiColorInput } from 'mui-color-input';
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
    const [category, setCategory] = useState('');
    const [color, setColor] = useState('#ffff');
    const categories = useCategories();
    const createAlert = useAlert();

    const handleClose = () => {
        onClose(isOpen);
    };

    const addCategory = async () => {
        const findCategory = await Category.findOne(category);
        const isExisting = findCategory.length > 0
        try {
            if (category === '') {
                createAlert(true, 'error', 'Veuillez saisir un nom de catégorie');
            } else if (color === '#ffff') {
                createAlert(true, 'error', 'Veuillez sélectionner une autre couleur');
            } else if (isExisting) {
                createAlert(true, 'warning', 'Cette catégorie existe déja !')
            } else {
                const newCategory = new Category(category, color);
                await newCategory.save();

                createAlert(true, 'success', 'Catégorie créée avec succès !');
                setCategory('');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCategory = (event) => {
        event.target.value = formatName(event.target.value);
        setCategory(event.target.value);
    };

    const handleColor = (color) => setColor(color);

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
                                <ListItem key={category.id} className={styles.categoryContainer}>
                                    <div className={styles.colorValue} style={{ backgroundColor: category.color }}></div>
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
                        <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 className={styles.containerHeading}>Choisissez une couleur</h3>
                            <MuiColorInput id={styles.colorPicker} value={color} onChange={handleColor} format="hex" isAlphaHidden />
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
