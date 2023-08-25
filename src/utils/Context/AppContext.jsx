import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [sentence, setSentence] = useState('');
    const [myController, setMyController] = useState({});
    const [speech, setSpeech] = useState([]);
    const [paired, setPaired] = useState(false);
    const [connected, setConnected] = useState(false);
    const [currentTarget, setCurrentTarget] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [words, setWords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMess, setAlertMess] = useState('');
    const [alertType, setAlertType] = useState('');
    const [category, setCategory] = useState('');

    return (
        <AppContext.Provider
            value={{
                sentence,
                setSentence,
                speech,
                setSpeech,
                paired,
                setPaired,
                connected,
                setConnected,
                myController,
                setMyController,
                currentTarget,
                setCurrentTarget,
                openModal,
                setOpenModal,
                words,
                setWords,
                categories,
                setCategories,
                sentences,
                setSentences,
                alert,
                setAlert,
                alertMess,
                setAlertMess,
                alertType,
                setAlertType,
                category,
                setCategory
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
