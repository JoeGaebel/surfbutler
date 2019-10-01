const { getRating } = require('../ratingService');
const rp = require('request-promise');

jest.mock('request-promise');

describe('getRating', () => {
    const fakeMSWHTML = `<html>
        <ul class="rating rating-large clearfix">
            <li class="rating-text text-dark">
                2-3<small>ft</small>
            </li>
            <li class="active">
                <i class="glyphicon glyphicon-star"></i>
            </li>
            <li class="active">
                <i class="glyphicon glyphicon-star"></i>
            </li>
            <li class="inactive">
                <i class="glyphicon glyphicon-star"></i>
            </li> 
            <li class="placeholder">
                <i class="glyphicon glyphicon-star"></i>
            </li>
            <li class="placeholder">
                <i class="glyphicon glyphicon-star"></i>
            </li>
        </ul>
    </html>`;

    const mswURLs = {
        'Dee Why': 'https://magicseaweed.com/Dee-Why-Point-Surf-Report/999/',
        'Curl Curl': 'https://magicseaweed.com/Curl-Curl-Surf-Report/1000/',
        'Freshwater': 'https://magicseaweed.com/Freshwater-Surf-Report/4997/',
        'Manly': 'https://magicseaweed.com/Sydney-Manly-Surf-Report/526/',
        'Bondi': 'https://magicseaweed.com/Sydney-Bondi-Surf-Report/996/',
        'Tamarama': 'https://magicseaweed.com/Tamarama-Beach-Surf-Report/5402/',
        'Bronte': 'https://magicseaweed.com/Bronte-Beach-Surf-Report/4579/',
    };

    beforeEach(() => {
        rp.mockReturnValue(Promise.resolve(fakeMSWHTML));
    });

    it('returns the rating', async () => {
        const rating = await getRating();
        expect(rating)
            .toEqual('⭐️⭐️✭');
    });

    it.each([
        'Dee Why',
        'Curl Curl',
        'Freshwater',
        'Manly',
        'Bondi',
        'Tamarama',
        'Bronte'
    ])('gets uses the right MSW url for %p', async (beach) => {
        rp.mockReset();
        await getRating(beach);
        expect(rp).toHaveBeenCalledWith(mswURLs[beach]);
    });
});
