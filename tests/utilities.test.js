jest.mock('../app/utilities/clock');
const getCurrentTimestamp = require('../app/utilities/clock').getCurrentTimestamp;
const getClosestTimeEntry = require('../app/utilities/timeEntry').getClosest;
const compassToDirection = require('../app/utilities/compass').toDirection;

describe('getClosestTimeEntry', () => {
    const currentTime = 1552068000;
    beforeEach(() => {
        getCurrentTimestamp.mockReturnValue(currentTime);
    });

    it('Get the closest time entry', () => {
        const elements = [
            { 'timestamp': currentTime + 100 },
            { 'timestamp': currentTime - 100 },
            { 'timestamp': currentTime + 50 },
        ];

        const closest = getClosestTimeEntry(elements);
        expect(closest.timestamp).toEqual(currentTime + 50);
    });
});

describe('compassDegreesToDirection', () => {
    it('Test for N', () => {
        expect(compassToDirection(0)).toEqual('N');
        expect(compassToDirection(10)).toEqual('N');
        expect(compassToDirection(350)).toEqual('N');
        expect(compassToDirection(360)).toEqual('N');
    });
    it('Test for S', () => {
        expect(compassToDirection(170)).toEqual('S');
        expect(compassToDirection(191)).toEqual('S');
    });
    it('Test for W', () => {
        expect(compassToDirection(260)).toEqual('W');
        expect(compassToDirection(280)).toEqual('W');
    });
    it('Test for E', () => {
        expect(compassToDirection(80)).toEqual('E');
        expect(compassToDirection(100)).toEqual('E');
    });
});