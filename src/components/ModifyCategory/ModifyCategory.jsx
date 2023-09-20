import { useEffect, useState } from 'react';
import { useCategories } from '../../utils/hooks/useCategories';
import { useAlert } from '../../utils/hooks/useAlert';
import Category from '../../controllers/categories';
import { modalTheme } from '../../utils/Theme/Modal/modalTheme';
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
import styles from './ModifyCategory.module.css';

function ModifyCategory(props) {
    const { onClose, isOpen, category } = props;
    const [color, setColor] = useState('#ffff');
    const categories = useCategories();
    const createAlert = useAlert();

    const handleClose = () => {
        onClose(isOpen);
    };

    const updateCategory = async (categoryID) => {
        try {
            await Category.update(categoryID, { color });
            createAlert(true, 'success', 'Modifications enregistrées avec succés !');
        } catch (e) {
            console.error(e);
        }
    };

    const handleColor = (color) => setColor(color);

    useEffect(() => {
        setColor(category?.color);
    }, [category]);

    return (
        <ThemeProvider theme={modalTheme}>
            <Dialog onClose={handleClose} open={isOpen}>
                <Box sx={{ padding: '32px', borderBottom: '1px solid var(--blue-dark)', backgroundColor: 'var(--blue)' }}>
                    <DialogTitle sx={{ fontFamily: 'DM sans', fontWeight: '500!important', fontSize: '20px' }}>Modifier une catégorie</DialogTitle>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '32px' }}>
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
                            <InputLabel htmlFor="word-original">Modifier le nom</InputLabel>
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
                                defaultValue={category?.name}
                                readOnly
                            />
                        </FormControl>
                        <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 className={styles.containerHeading}>Modifiez la couleur</h3>
                            <MuiColorInput
                                id={styles.colorPicker}
                                value={color}
                                onChange={handleColor}
                                format="hex"
                                isAlphaHidden
                                sx={{ '& input': { fontSize: '14px', paddingLeft: '8px', color: 'var(--grey-light)' } }}
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
                                onClick={() => updateCategory(category?.id)}
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

export default ModifyCategory;
