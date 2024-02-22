import { db } from '../helpers/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

export const useCategories = () => {
    const { categories, setCategories } = useContext(AppContext);

    const query = useLiveQuery(async () => {
        setCategories(await db.categories.toArray());
    });

    return categories;
};
