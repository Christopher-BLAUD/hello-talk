import { useContext } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import { ThemeProvider } from '@emotion/react';
import { appModal } from '../../utils/Theme/AppModal/appModal';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';



function SentenceModal(props) {
    const { onClose, isOpen } = props;
    let { openSentenceModal, setSentence, setSpeech } = useContext(AppContext);

    const handleClose = () => {
        onClose(isOpen);
    };

    const handleListItemClick = (value, sounds) => {
        setSentence(value);
        setSpeech(sounds)
        onClose(value);
    };

    return (
        <ThemeProvider theme={appModal}>
            <Dialog onClose={handleClose} open={isOpen}>
                <DialogTitle>Phrases enregistrées</DialogTitle>
                <List>

                </List>
            </Dialog>
        </ThemeProvider>
    );
}


export default SentenceModal;
