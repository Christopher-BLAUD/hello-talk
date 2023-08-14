import { formatName } from "../src/utils/helpers/formatName";

it('should return a hello string with the first letter capitalized', () => {
    expect(formatName("hello")).toBe('Hello');
})

it('should return the first word of string with the first letter capitalized', () => {
    expect(formatName("hello world")).toBe('Hello world');
})