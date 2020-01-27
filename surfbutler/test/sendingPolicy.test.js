const { filter } = require('../src/sendingPolicy');

describe('filter', () => {
    it.each([0, 1])('should surf ratings of %p', (badRating) => {
        expect(filter(badRating)).toBe(true);
    });

    it.each([2, 3, 4, 5])('should not filter surf ratings of %p', (goodRating) => {
        expect(filter(goodRating)).toBe(false);
    });
});