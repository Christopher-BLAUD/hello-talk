import { useContext } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { useCategories } from '../../utils/hooks/useCategories';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

function Modal(props) {
    const { onClose, isOpen, title } = props;
    let { openModal, setCategory } = useContext(AppContext);
    const categories = useCategories();

    const handleClose = () => {
        onClose(isOpen);
    };

    const handleListItemClick = (value) => {
        setCategory(value.name)
        onClose(value);
    };

    return (
        <ThemeProvider theme={modalTheme}>
            <Dialog onClose={handleClose} open={isOpen}>
                <DialogTitle>{title}</DialogTitle>
                <List>
                    {categories?.map((category) => (
                        <ListItem key={category.id}>
                            <ListItemButton onClick={() => handleListItemClick(category)} key={category} component="button" className={openModal ? 'selectable' : ''}>
                                <ListItemText primary={category.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </ThemeProvider>
    );
}

const modalTheme = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                root: {
                    '& .MuiPaper-root': { backgroundColor: '#3c435d', minWidth: '400px', paddingBottom: '24px', gap: '24px' }
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontFamily: 'DM sans',
                    fontWeight: '700'
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    pt: 0
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    padding: '0'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&:focus': { backgroundColor: 'rgba(252, 222, 156, 0.21)' }
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    padding: '8px 32px',
                    '& .MuiTypography-root': { fontFamily: 'Satoshi', fontWeight: '400', color: "var(--grey-light)" }
                }
            }
        }
    }
});

export default Modal;
