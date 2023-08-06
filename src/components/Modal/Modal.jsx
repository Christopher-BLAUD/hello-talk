import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import styles from './Modal.module.css';
import { useContext } from 'react';
import { SpeechContext } from '../../utils/Context/SpeechContext';

const categories = ['Présentation', 'Repas', 'Travail', 'Loisirs'];

function Modal(props) {
    const { onClose, isOpen } = props;
    let { openModal } = useContext(SpeechContext);

    const handleClose = () => {
        onClose(isOpen);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog
            onClose={handleClose}
            open={isOpen}
            className={styles.modal}
            sx={{ '& .MuiPaper-root': { backgroundColor: '#3c435d', minWidth: '400px', paddingBottom: '24px', gap: '24px' } }}
        >
            <DialogTitle sx={{ fontFamily: 'DM sans', fontWeight: '700' }}>Catégories</DialogTitle>
            <List sx={{ pt: 0 }} className="list">
                {categories.map((category) => (
                    <ListItem key={categories.indexOf(category)} className="category" sx={{ padding: '0' }}>
                        <ListItemButton
                            onClick={() => handleListItemClick(category)}
                            key={category}
                            component="button"
                            className={openModal ? 'selectable' : ''}
                            sx={{ '&:focus': { backgroundColor: 'rgba(252, 222, 156, 0.21)' } }}
                        >
                            <ListItemText
                                primary={category}
                                sx={{ padding: '8px 32px', '& .MuiTypography-root': { fontFamily: 'Satoshi', fontWeight: '500' } }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default Modal;
