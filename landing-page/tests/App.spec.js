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

        wrapper.find('button').trigger('click');

        expect(axios.post).toHaveBeenCalledWith(
            'https://5h7fqfsyik.execute-api.ap-southeast-2.amazonaws.com/default/surfbutler-landingpage-backend',
            { phoneNumber: '0439363614', beaches: ['bondi', 'bronte'] },
        );
    });
});
