import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../Helpers/db';

export const useWords = () => {
    const { words, setWords } = useContext(AppContext);

    const query = useLiveQuery(async () => {
        setWords(await db.words.toArray())
    });

    return words;
};
