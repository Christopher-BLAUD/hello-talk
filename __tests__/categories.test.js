import Category from '../src/controllers/categories';
import { db } from '../src/utils/helpers/db';

jest.mock('../src/utils/helpers/db');
Category.save = jest.fn();
Category.delete = jest.fn();
Category.findOne = jest.fn();
Category.updateScore = jest.fn();
Category.update = jest.fn();

describe('class category', () => {
    const caterory = new Category('Présentation', '4f6fd8');

    it('should save the category into database', async () => {
        await caterory.save();

        expect(db.categories.add).toHaveBeenCalledTimes(1);
        expect(db.categories.add).toHaveBeenCalledWith(caterory);
    });

    it('should throw an error if name is not specified', async () => {
        const otherCategory = new Category(undefined, '#4f6fd8');

        await expect(otherCategory.save()).rejects.toThrowError('Category contains no data');
    });

    it('should throw an error if color is not specified', async () => {
        const otherCategory = new Category('Présentation', undefined);

        await expect(otherCategory.save()).rejects.toThrowError('Category contains no data');
    });

    it('should call the delete method with specific parameters', async () => {
        const id = 2;

        await Category.delete(id);

        expect(Category.delete).toHaveBeenCalledTimes(1);
        expect(Category.delete).toHaveBeenCalledWith(id);
    });

    it('should call the findOne method with specific parameters', async () => {
        const name = 'Présentation';

        await Category.findOne(name);

        expect(Category.findOne).toHaveBeenCalledTimes(1);
        expect(Category.findOne).toHaveBeenCalledWith(name);
    });

    it('should call the updateScore method with specific parameters', async () => {
        const id = 1;
        const changes = { score: 1 };

        await Category.updateScore(id, changes);

        expect(Category.updateScore).toBeCalledTimes(1);
        expect(Category.updateScore).toBeCalledWith(id, changes);
    });

    it('should call the update method with specific parameters', async () => {
        const id = 6;
        const changes = { color: '#4f6fd8' };

        await Category.update(id, changes);

        expect(Category.update).toBeCalledTimes(1);
        expect(Category.update).toBeCalledWith(id, changes);
    });
});
