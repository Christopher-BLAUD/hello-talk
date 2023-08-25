import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../Helpers/db';

export const useWords = (filter) => {
    const { words, setWords } = useContext(AppContext);

    const query = useLiveQuery(async () => {
        filter !== undefined ? setWords(await db.words.where('category').equals(filter).toArray()) :  setWords(await db.words.orderBy('id').toArray());
    });
    
    return words;
};
