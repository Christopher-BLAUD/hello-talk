import { ThemeProvider } from '@emotion/react';
import { appModal } from '../../utils/Theme/AppModal/appModal';
import { Box } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import plan from '../../assets/img/plan.svg';


function PlanModal(props) {
    const { onClose, isOpen } = props;

    const handleClose = () => {
        onClose(isOpen);
    };

    const handleListItemClick = (value, sounds) => {
        onClose(value);
    };

    return (
        <ThemeProvider theme={appModal}>
            <Dialog onClose={handleClose} open={isOpen}>
                <DialogTitle>Schéma de connexion</DialogTitle>
                <Box sx={{ padding: "72px" ,"& img": {
                    width: "100%"
                }}}>
                    <img src={plan} alt="schéma de connexion du controlleur" />
                </Box>
            </Dialog>
        </ThemeProvider>
    );
}

export default PlanModal;
