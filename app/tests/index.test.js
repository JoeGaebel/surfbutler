const { handler } = require('../index');
const { getSummary } = require('../surfDataService');
const { send } = require('../messageService');

jest.mock('../messageService');
jest.mock('../surfDataService');

describe('handler', () => {
    beforeEach(() => {
        console.log = jest.fn();
    });

    it('gets the bondi and tamarama surf report', async () => {
        getSummary.mockImplementation(beachName => Promise.resolve(`${ beachName } summary`));

        await handler();

        expect(getSummary).toHaveBeenCalledWith('Bondi', '5842041f4e65fad6a7708bf8');
        expect(getSummary).toHaveBeenCalledWith('Tamarama', '584204204e65fad6a77093eb');
        expect(getSummary).toHaveBeenCalledWith('Bronte', '584204204e65fad6a77093ef');

        expect(send).toHaveBeenCalledWith('Bondi summary\nTamarama summary\nBronte summary');
    });
});
