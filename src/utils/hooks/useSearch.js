import { db } from '../Helpers/db';
import { useEffect, useState } from 'react';
/**
 * Find specific items in the database
 * @param {string} type word, sentence or category
 * @returns {[any[], function]} an array of found items and a function to apply the search
 */
export const useSearch = (type) => {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);

    const findItems = async (search) => {
        switch (type) {
            case 'word':
                setResult(await db.words.where('original').startsWith(search).sortBy('id'));
                break;
            case 'sentence':
                setResult(await db.sentences.where('sentence').startsWith(search).sortBy('id'));
                break;
            case 'category':
                setResult(await db.categories.where('name').startsWith(search).sortBy('id'));
                break;
            default:
                return;
        }
    };

    useEffect(() => {
        findItems(search);
    }, [search]);

    return [result, setSearch];
};
