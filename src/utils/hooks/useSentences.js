import { db } from '../helpers/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useContext, useState } from 'react';
import { AppContext } from '../Context/AppContext';

export const useSentences = (limit) => {
    const { sentences, setSentences } = useContext(AppContext);
    const [lastSentences, setLastSentences] = useState([]);

    useLiveQuery(async () => {
        if (limit !== undefined) {
            setLastSentences(await db.sentences.orderBy('id').reverse().limit(limit).toArray());
        } else {
            setSentences(await db.sentences.orderBy('id').toArray());
        }
    });

    return limit !== undefined ? [lastSentences, setLastSentences] : [sentences, setSentences];
};
