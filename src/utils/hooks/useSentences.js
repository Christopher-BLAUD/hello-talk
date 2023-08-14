import { db } from '../Helpers/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

export const useSentences = () => {
    const { sentences, setSentences } = useContext(AppContext);

    const query = useLiveQuery(async () => {
        setSentences(await db.sentences.orderBy('id').toArray());

    });

    return [sentences, setSentences];
};
