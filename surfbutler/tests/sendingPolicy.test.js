const { filter } = require('../sendingPolicy');

describe('filter', function () {
    it('should filter bad surf reports', function () {
        expect(filter({
            activeStars: 0,
            inactiveStars: 0
        })).toBe(true);
        expect(filter({
            activeStars: 0,
            inactiveStars: 1
        })).toBe(true);
    });

    it('should not filter good surf reports', function () {
        expect(filter({
            activeStars: 5,
            inactiveStars: 0
        })).toBe(false);
        expect(filter({
            activeStars: 1,
            inactiveStars: 0
        })).toBe(false);
        expect(filter({
            activeStars: 0,
            inactiveStars: 2
        })).toBe(false);
    });
});