const { getSummary } = require('../src/surfDataService');

describe('getSummary', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('summarizes', async () => {
        const { name, message, rating } = await getSummary('Bondi', '5842041f4e65fad6a7708bf8');
        console.log(message);

        expect(name).toEqual('Bondi');
        expect(rating).toBeFinite();

        expect(message).toMatch(new RegExp('Bondi [★]+'));
        expect(message).toMatch(new RegExp('.*º.*, sunrise .*:'));
        expect(message).toMatch(new RegExp('.*ft waves'));
        expect(message).toMatch(new RegExp('.*.*tide'));
        expect(message).toMatch(new RegExp('.*the swell\'s .*ft at .*s.* (⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️),'));
        expect(message).toMatch(new RegExp('.* wind at .*kts (⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️)$'));
    });
});