import { db } from '../helpers/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

export const useWords = () => {
    const { words, setWords } = useContext(AppContext);

    useLiveQuery(async () => {
        setWords(await db.words.orderBy('id').toArray());
    });

    return [words, setWords];
};
