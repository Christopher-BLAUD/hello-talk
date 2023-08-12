import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../helpers/db';

export const useCategories = () => {
    
    const categories = useLiveQuery(async () => {
        return await db.categories.toArray();
    });

    return categories;
};
