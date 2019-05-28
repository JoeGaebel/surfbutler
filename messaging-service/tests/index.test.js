const { handler } = require('../index');
const { getSummary } = require('../surfDataService');
const { send, getSegmentIds } = require('../messageService');

jest.mock('../messageService');
jest.mock('../surfDataService');

describe('handler', () => {
    beforeEach(() => {
        console.log = jest.fn();
    });

    it('gets the bondi and tamarama surf report', async () => {
        getSummary.mockImplementation(beachName => Promise.resolve({
            name: beachName,
            message: `${ beachName } summary`
        }));

        getSegmentIds.mockReturnValue(Promise.resolve({
            'Bondi': 'bondi seg',
            'Tamarama': 'tam seg',
            'Bronte': 'bronte seg',
        }));

        await handler();

        expect(getSummary).toHaveBeenCalledWith('Bondi', '5842041f4e65fad6a7708bf8');
        expect(getSummary).toHaveBeenCalledWith('Tamarama', '584204204e65fad6a77093eb');
        expect(getSummary).toHaveBeenCalledWith('Bronte', '584204204e65fad6a77093ef');

        expect(send).toHaveBeenCalledWith({
            segmentId: 'bondi seg',
            message: 'Bondi summary',
            name: 'Bondi',
            applicationId: 'efba3f1fc914421f88cb01c0efb16ffd'
        });

        expect(send).toHaveBeenCalledWith({
            segmentId: 'tam seg',
            message: 'Tamarama summary',
            name: 'Tamarama',
            applicationId: 'efba3f1fc914421f88cb01c0efb16ffd'
        });

        expect(send).toHaveBeenCalledWith({
            segmentId: 'bronte seg',
            message: 'Bronte summary',
            name: 'Bronte',
            applicationId: 'efba3f1fc914421f88cb01c0efb16ffd'
        });
    });
});
