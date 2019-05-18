import { mount } from '@vue/test-utils';
import axios from 'axios';
import App from '../src/App.vue';

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve()),
}));

describe('App', () => {
    it('saves the phone number and beaches when clicking the button', () => {
        const wrapper = mount(App);

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
            { phoneNumber: '0439363614', beaches: ['bondi', 'bronte'] },
        );
    });

    it('disables the button unless a box is ticked and a phone number is entered', () => {
        const wrapper = mount(App);

        const submitButton = wrapper.find('button');
        expect(submitButton.attributes().disabled).toEqual('disabled');
    });
});
