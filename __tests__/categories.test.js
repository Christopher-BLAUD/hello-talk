import Category from "../src/controllers/categories";
import { db } from "../src/utils/Helpers/db";

jest.mock("../src/utils/Helpers/db")
Category.save = jest.fn

describe('class category', () => {
    const caterory = new Category("Présentation", "4f6fd8");

    it('should save the category into database', async () => {
        await caterory.save()

        expect(db.categories.add).toHaveBeenCalledTimes(1)
        expect(db.categories.add).toHaveBeenCalledWith(caterory)
    })

    it('should throw an error if name is not specified', async () => {
        const otherCategory = new Category(undefined, "#4f6fd8");

        await expect(otherCategory.save()).rejects.toThrowError("Category contains no data")
    })

    it('should throw an error if color is not specified', async () => {
        const otherCategory = new Category("Présentation", undefined);

        await expect(otherCategory.save()).rejects.toThrowError("Category contains no data")
    })
})