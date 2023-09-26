import { findANumber } from '../utils/Helpers/regex';
import { db } from '../utils/Helpers/db';

class Category {
    constructor(name, color, score) {
        this.name = name;
        this.color = color;
        this.score = score || 0;
    }

    async save() {
        if (findANumber.test(this.name)) throw new Error('The name of category must be a string');

        if (this.name !== undefined && this.color !== undefined) {
            await db.categories.add(this);
        } else {
            throw new Error('Category contains no data');
        }
    }

    static async findOne(name) {
        try {
            return await db.categories.where('name').equals(name).toArray()
        } catch (e) {
            throw new Error('An error occurred while finding the category.')
        }
    }

    static async delete(id) {
        try {
            await db.categories.delete(id)
        } catch (e) {
            throw new Error('An error occurred while deleting the category.')
        }
    }
}

export default Category;
