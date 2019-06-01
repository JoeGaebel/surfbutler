import { mount } from '@vue/test-utils';
import axios from 'axios';
import LandingPage from '../src/components/LandingPage.vue';

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve()),
}));

describe('App', () => {
    it('saves the phone number with country code and beaches when clicking the button', () => {
        const wrapper = mount(LandingPage);

        const phoneField = wrapper.find('#VuePhoneNumberInput_phone_number');
        phoneField.setValue('0439363614');
        phoneField.trigger('change');

        const bondiCheckbox = wrapper.find('#bondi');
        bondiCheckbox.setChecked(true);
        bondiCheckbox.trigger('change');

        const bronteCheckbox = wrapper.find('#bronte');
        bronteCheckbox.setChecked(true);
        bronteCheckbox.trigger('change');

        const submitButton = wrapper.find('button');
        expect(submitButton.attributes().disabled).toEqual(undefined);
        submitButton.trigger('click');

        expect(axios.post).toHaveBeenCalledWith(
            'https://oe8wr7ipkk.execute-api.ap-southeast-2.amazonaws.com/default/surfbutler-signup-parser',
            { phoneNumber: '+610439363614', beaches: ['bondi', 'bronte'] },
        );
    });

    it('disables the button unless a box is ticked and a phone number is entered', () => {
        const wrapper = mount(LandingPage);

        const submitButton = wrapper.find('button');
        expect(submitButton.attributes().disabled).toEqual('disabled');
    });
});
