import { mount } from '@vue/test-utils'
import App from '../src/App'
import axios from 'axios'

jest.mock('axios');

describe('App', () => {
    it('saves the phone number when clicking the button', () => {
        const wrapper = mount(App);

        const phoneField = wrapper.find('VuePhoneNumberInput');
        phoneField.setValue("0439363614");
        phoneField.trigger('change')
    });
});

