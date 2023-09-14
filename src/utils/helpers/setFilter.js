export const setFilter = (type, stack) => {
    switch (type) {
        case 'id':
            return stack.sort((a, b) => a.id - b.id);
        case 'alphabetical':
            return stack.sort((a, b) => {
                if (a.original < b.original || a.sentence < b.sentence) return -1;
                if (a.original > b.original || a.sentence > b.sentence) return 1;
                return 0;
            });
        case 'category':
            return stack.sort((a, b) => {
                if (a.category < b.category) return -1;
                if (a.category > b.category) return 1;
                return 0;
            });
        case 'score':
            return stack.sort((a, b) => a.score - b.score).reverse();
        default:
            return stack;
    }
};
