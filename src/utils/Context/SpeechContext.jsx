import { createContext, useState } from 'react';

export const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
    const [sentence, setSentence] = useState('');
    const [myController, setMyController] = useState({});
    const [speech, setSpeech] = useState([]);
    const [paired, setPaired] = useState(false);
    const [connected, setConnected] = useState(false);
    const [currentTarget, setCurrentTarget] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    return (
        <SpeechContext.Provider value={{ sentence, setSentence, speech, setSpeech, paired, setPaired, connected, setConnected, myController, setMyController, currentTarget, setCurrentTarget, openModal, setOpenModal }}>{children}</SpeechContext.Provider>
    );
};
