const { getSummary } = require('../surfDataService');

describe('getSummary', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('summarizes', async () => {
        const summary = await getSummary('Bondi', '5842041f4e65fad6a7708bf8');
        console.log(summary);
        expect(summary).toMatch(new RegExp('.*The swell\'s .*ft at .*s.*'));
        expect(summary).toMatch(new RegExp('.*ft waves'));
        expect(summary).toMatch(new RegExp('.*tide'));
        expect(summary).toMatch(new RegExp('sunrise .*:'));
        expect(summary).toMatch(new RegExp('.*º.*'));
        expect(summary).toMatch(new RegExp('.* wind at .*kts'));
    });
});
