const { handler } = require('../src');
const { getSummary } = require('../src/surfDataService');
const { send, getSegmentIds } = require('../src/messageService');
const { filter } = require('../src/sendingPolicy');

jest.mock('../src/messageService');
jest.mock('../src/surfDataService');
jest.mock('../src/sendingPolicy');

xdescribe('handler', () => {
    beforeEach(() => {
        console.log = jest.fn();
        getSummary.mockImplementation(beachName => Promise.resolve({
            name: beachName,
            message: `${ beachName } summary`
        }));

        getSegmentIds.mockReturnValue(Promise.resolve({
            'Bondi': 'bondi seg',
            'Tamarama': 'tam seg',
            'Bronte': 'bronte seg',
            'Curl-Curl': 'curl curl seg',
            'Dee-Why': 'dee why seg',
            'Freshwater': 'freshwater seg',
            'Manly': 'manly seg'
        }));
    });

    it('should not send when filtered', async () => {
        filter.mockReturnValue(true);

        await handler();

        expect(getSummary)
            .toHaveBeenCalledWith('Bondi', '5842041f4e65fad6a7708bf8');
        expect(send).not.toHaveBeenCalled();
    });

    it('gets the surf reports', async () => {
        filter.mockReturnValue(false);

        await handler();

        expect(getSummary)
            .toHaveBeenCalledWith('Bondi', '5842041f4e65fad6a7708bf8');
        expect(getSummary)
            .toHaveBeenCalledWith('Tamarama', '584204204e65fad6a77093eb');
        expect(getSummary)
            .toHaveBeenCalledWith('Bronte', '584204204e65fad6a77093ef');

        expect(send)
            .toHaveBeenCalledWith({
                segment: 'bondi seg',
                message: 'Bondi summary',
                key: 'Bondi',
                applicationId: 'efba3f1fc914421f88cb01c0efb16ffd'
            });

        expect(send)
            .toHaveBeenCalledWith({
                segment: 'tam seg',
                message: 'Tamarama summary',
                key: 'Tamarama',
                applicationId: 'efba3f1fc914421f88cb01c0efb16ffd'
            });

        expect(send)
            .toHaveBeenCalledWith({
                segment: 'bronte seg',
                message: 'Bronte summary',
                key: 'Bronte',
                applicationId: 'efba3f1fc914421f88cb01c0efb16ffd'
            });

        expect(send)
            .toHaveBeenCalledWith({
                segment: 'curl curl seg',
                message: 'Curl Curl summary',
                key: 'Curl-Curl',
                applicationId: 'efba3f1fc914421f88cb01c0efb16ffd'
            });
    });
});
