import { validator } from "../src/utils/Helpers/validator";

describe("test user entries", () => {
    it('should return false if input contains a number', () => {
        expect(validator("word", "hello 666")).toBeFalsy()
    })

    it('should return false if input contains a word', () => {
        expect(validator("word", "hello 666")).toBeFalsy()
    })

    it('should return true if input only contains numbers', () => {
        expect(validator("number", "666")).toBeTruthy()
    })

    it('should return true if input only contains words', () => {
        expect(validator("word", "hello")).toBeTruthy()
    })
})