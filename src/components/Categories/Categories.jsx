import { useCategories } from '../../utils/hooks/useCategories';
import { db } from '../../utils/Helpers/db';
import { Avatar, Tooltip, Zoom } from '@mui/material';
import NoData from '../NoData/NoData';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './Categories.module.css';

function Categories() {
    const categories = useCategories();

    const deleteCategories = async (categoryId) => {
        return await db.categories.delete(categoryId);
    };

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.heading}>Catégories enregistrées</h3>
            {categories.length > 0 ? (
                <ul className={styles.listContainer}>
                    {categories?.map((category) => (
                        <li key={category.id} className={styles.rows}>
                            <span>
                                <Avatar>
                                    <FolderOutlinedIcon />
                                </Avatar>
                            </span>
                            <span>{category.name}</span>
                            <div className={styles.iconContainer} onClick={() => deleteCategories(category.id)}>
                                <Tooltip placement='left' arrow={true} TransitionComponent={Zoom} title="Supprimer">
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
