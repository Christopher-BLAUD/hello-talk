import { findANumber } from '../utils/Helpers/regex';
import { db } from '../utils/Helpers/db';

class Category {
    constructor(name, colorTheme, score) {
        this.name = name;
        this.colorTheme = colorTheme;
        this.score = score || 0;
    }

    async save() {
        if (findANumber.test(this.name)) throw new Error('The name of category must be a string');

        if (this.name !== undefined && this.colorTheme !== undefined) {
            await db.categories.add(this);
        } else {
            throw new Error('Category contains no data');
        }
    }
}

export default Category;
