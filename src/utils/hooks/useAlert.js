import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

export const useAlert = () => {
    const { setAlert, setAlertType, setAlertMess } = useContext(AppContext);

    const createAlert = (isVisible, type, message) => {
        setAlert(isVisible);
        setAlertType(type);
        setAlertMess(message);

        setTimeout(() => setAlert(false), 5000);
    };

    return createAlert;
};
