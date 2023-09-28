import { useCallback, useEffect, useState } from 'react';
import { useCategories } from '../../utils/hooks/useCategories';
import { Tooltip, Zoom } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Category from '../../controllers/categories';
import ModifyCategory from '../ModifyCategory/ModifyCategory';
import NoData from '../NoData/NoData';
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';
import styles from './Categories.module.css';
import { setFilter } from '../../utils/Helpers/setFilter';

function Categories() {
    const categories = useCategories();
    const [category, setCategory] = useState();
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [activeFilter, setActiveFilter] = useState('');
    const [open, setOpen] = useState(false);

    const deleteCategories = async (categoryId) => await Category.delete(categoryId);
    const handleClose = () => setOpen(false);

    const handleClickOpen = (category) => {
        setOpen(true);
        setCategory(category);
    };

    const applyFilter = (type) => {
        setFilteredCategories(setFilter(type, categories));
        setActiveFilter(type);
    };
    useEffect(() => console.log(filteredCategories), [filteredCategories]);

    return (
        <div className={styles.wrapper}>
            <ModifyCategory onClose={handleClose} isOpen={open} category={category} />
            <div className={styles.headingContainer}>
                <h3 className={styles.heading}>Catégories enregistrées</h3>
                <div className={styles.searchWrapper}>
                    <div className={styles.filters}>
                        <button onClick={() => applyFilter('id')} className={activeFilter === 'id' ? styles.activeFilter : undefined}>
                            ID
                        </button>
                        <button onClick={() => applyFilter('alphabetical')} className={activeFilter === 'alphabetical' ? styles.activeFilter : undefined}>
                            Alphabétique
                        </button>
                        <button onClick={() => applyFilter('score')} className={activeFilter === 'score' ? styles.activeFilter : undefined}>
                            Utilisation
                        </button>
                    </div>
                </div>
            </div>
            {categories.length > 0 ? (
                <ul className={styles.listContainer}>
                    {/* {categories?.map((category) => (
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
                    ))} */}
                    {filteredCategories.length > 0
                        ? filteredCategories?.map((category) => (
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
                          ))
                        : categories?.map((category) => (
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
