import { useContext } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import { ThemeProvider } from '@emotion/react';
import { useCategories } from '../../utils/hooks/useCategories';
import { db } from '../../utils/Helpers/db';
import { appModal } from '../../utils/Theme/AppModal/appModal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';


function CategoryModal(props) {
    const { onClose, isOpen } = props;
    let { openCategoryModal, setWords } = useContext(AppContext);
    const categories = useCategories();


    const handleClose = () => {
        onClose(isOpen);
    };

    const handleListItemClick = async (value) => {
        setWords(await db.words.where('category').equals(value).toArray());
        onClose(value);
    };

    return (
        <ThemeProvider theme={appModal}>
            <Dialog onClose={handleClose} open={isOpen}>
                <DialogTitle>Catégories</DialogTitle>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => handleListItemClick('')} component="button" className={openCategoryModal ? 'selectable' : ''}>
                            <ListItemText primary={'Répertoire complet'} sx={{"& .MuiTypography-root": {fontWeight: '500'}}}/>
                        </ListItemButton>
                    </ListItem>
                    {categories?.map((category) => (
                        <ListItem key={category.id}>
                            <ListItemButton onClick={() => handleListItemClick(category.name)} component="button" className={openCategoryModal ? 'selectable' : ''}>
                                <ListItemText primary={category.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </ThemeProvider>
    );
}

export default CategoryModal;
