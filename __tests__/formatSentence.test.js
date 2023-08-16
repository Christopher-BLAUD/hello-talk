import { formatSentence } from '../src/utils/Helpers/formatSentence';

describe('should return a formated sentence whitout white-spaces at the start and end of a string', () => {
    test('the string is empty', () => {
        let str = '';
        expect(formatSentence(str, 'hello')).toEqual('hello');
    });

    test('the string contains one word', () => {
        let str = 'hello';
        expect(formatSentence(str, 'world')).toEqual('hello world');
    });

    test('the string contains two words', () => {
        let str = 'sky is';
        expect(formatSentence(str, 'blue')).toEqual('sky is blue');
    });
});
