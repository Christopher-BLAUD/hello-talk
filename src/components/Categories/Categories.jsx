import { useState } from 'react';
import { useCategories } from '../../utils/hooks/useCategories';
import { Tooltip, Zoom } from '@mui/material';
import Category from '../../controllers/categories';
import ModifyCategory from '../ModifyCategory/ModifyCategory';
import NoData from '../NoData/NoData';
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';
import styles from './Categories.module.css';

function Categories() {
    const categories = useCategories();
    const [category, setCategory] = useState();
    const [open, setOpen] = useState(false);

    const deleteCategories = async (categoryId) => await Category.delete(categoryId);
    const handleClose = () => setOpen(false);

    const handleClickOpen = (category) => {
        setOpen(true);
        setCategory(category);
    };

    return (
        <div className={styles.wrapper}>
            <ModifyCategory onClose={handleClose} isOpen={open} category={category} />
            <h3 className={styles.heading}>Catégories enregistrées</h3>
            {categories.length > 0 ? (
                <ul className={styles.listContainer}>
                    {categories?.map((category) => (
                        <li key={category.id} className={styles.rows}>
                            <div className={styles.color} style={{ backgroundColor: category.color }}></div>
                            <span>{category.name}</span>
                            <div className={styles.iconContainer}>
                                <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Modifier" onClick={() => handleClickOpen(category)}>
                                    <EditNoteIcon className={styles.editIcon} />
                                </Tooltip>
                                <Tooltip placement="top" arrow={true} TransitionComponent={Zoom} title="Supprimer" onClick={() => deleteCategories(category.id)}>
                                    <CancelIcon className={styles.cancelIcon} />
                                </Tooltip>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <NoData text={'Oups ... Aucune catégorie disponible.'} />
            )}
        </div>
    );
}

export default Categories;
