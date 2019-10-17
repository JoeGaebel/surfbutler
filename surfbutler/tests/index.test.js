const { handler } = require('../index');
const { getSummary } = require('../surfDataService');
const { send, getSegmentIds } = require('../messageService');

jest.mock('../messageService');
jest.mock('../surfDataService');

xdescribe('handler', () => {
    beforeEach(() => {
        console.log = jest.fn();
    });

    it('gets the surf reports', async () => {
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
