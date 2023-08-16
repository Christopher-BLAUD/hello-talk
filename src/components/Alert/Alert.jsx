import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';

function AlertPopUp(props) {
    let { alert, onClick, type, text } = props;

    return (
        <Slide direction="left" in={alert}>
            <Alert
                severity={type || 'error'}
                variant="filled"
                action={
                    <IconButton aria-label="close" color="inherit" size="small" onClick={onClick}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ position: 'fixed', top: '56px', right: '16px', zIndex: '10000' }}
            >
                {text}
            </Alert>
        </Slide>
    );
}

export default AlertPopUp;
