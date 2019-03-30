const { getSummary } = require('../surfDataService');

describe('getSummary', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('summarizes', async () => {
        const summary = await getSummary('Bondi', '5842041f4e65fad6a7708bf8');
        console.log(summary);
        expect(summary).toMatch(new RegExp('Swells:.*'));
        expect(summary).toMatch(new RegExp('.*waves'));
        expect(summary).toMatch(new RegExp('.*tide'));
        expect(summary).toMatch(new RegExp('Sunrise .*:'));
        expect(summary).toMatch(new RegExp('.*º.*'));
        expect(summary).toMatch(new RegExp('.* wind at .*kts'));
    });
});
