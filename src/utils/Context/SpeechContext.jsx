import { createContext, useState } from 'react';

export const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
    const [sentence, setSentence] = useState('');
    const [myDevice, setMyDevice] = useState({});
    const [speech, setSpeech] = useState([]);
    const [paired, setPaired] = useState(false);
    const [connected, setConnected] = useState(false);

    return (
        <SpeechContext.Provider value={{ sentence, setSentence, speech, setSpeech, paired, setPaired, connected, setConnected, myDevice, setMyDevice }}>{children}</SpeechContext.Provider>
    );
};
