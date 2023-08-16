import { useCategories } from '../../utils/hooks/useCategories';
import { db } from '../../utils/Helpers/db';
import { Avatar } from '@mui/material';
import NoData from '../NoData/NoData';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
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
                                <Avatar
                                    sx={{
                                        backgroundColor: 'var(--grey-light)',
                                        '& svg': {
                                            fill: 'var(--blue-icon)!important',
                                            height: "18px"
                                        }
                                    }}
                                >
                                    <FolderOutlinedIcon />
                                </Avatar>
                            </span>
                            <span>{category.name}</span>
                            <div className={styles.iconContainer} onClick={() => deleteCategories(category.id)}>
                                <CancelIcon className={styles.cancelIcon} />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <NoData text={"Oups ... Aucune catégorie disponible."}/>
            )}
        </div>
    );
}

export default Categories;
