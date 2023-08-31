
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

export const useCategories = () => {
    const { categories, setCategories } = useContext(AppContext);



    return categories;
};
