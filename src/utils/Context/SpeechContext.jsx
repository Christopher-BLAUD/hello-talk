import { createContext, useState } from 'react';

export const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
    const [sentence, setSentence] = useState('');
    const [speech, setSpeech] = useState([]);

    return (
        <SpeechContext.Provider value={{ sentence, setSentence, speech, setSpeech }}>{children}</SpeechContext.Provider>
    );
};
