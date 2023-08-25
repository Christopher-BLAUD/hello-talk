import { db } from '../Helpers/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';


export const useWords = () => {
    const [words, setWords] = useState([]);

    const query = useLiveQuery(async () => {
        setWords(await db.words.orderBy('id').toArray())
    });

    return words;
};
