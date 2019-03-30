const { getSummary } = require('../app/surfDataService');

describe('getSummary', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('summarizes', async () => {
        const summary = await getSummary('Bondi', '5842041f4e65fad6a7708bf8');
        console.log(summary);
        expect(summary).toMatch(new RegExp('Swell: .*'));
        expect(summary).toMatch(new RegExp('Wave height: .*'));
        expect(summary).toMatch(new RegExp('Tide: .*'));
        expect(summary).toMatch(new RegExp('Sunrise: .* (am|AM)'));
        expect(summary).toMatch(new RegExp('Weather: .*ºC.*'));
        expect(summary).toMatch(new RegExp('Wind: .* .*kts'));
    });
});
