export const validator = (type, value) => {
    const regexp = {
        word: /[A-Za-z]/,
        number: /[0-9]/
    };

    switch (type) {
        case 'word':
            return !regexp.number.test(value) ? true : false;
        case 'number':
            return !regexp.word.test(value) ? true : false;
        default:
            return;
    }
};

