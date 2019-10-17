<template>
    <div id="landing-page">
        <div class="header">
            Surf Butler
        </div>
        <div class="panel">
            <div class="description">
                Get a text the night before it's pumping
            </div>
            <div class="call-to-action">
                Sign up to receive free surf reports for the beaches you surf. Coming soon!
            </div>
            <div class="form">
                <div class="checkboxes columns is-mobile">
                    <div class="column">
                        <BeachBox
                            v-model="beaches"
                            name="bondi"
                        />
                        <BeachBox
                            v-model="beaches"
                            name="tamarama"
                        />
                        <BeachBox
                            v-model="beaches"
                            name="bronte"
                        />
                        <BeachBox
                            v-model="beaches"
                            name="cronulla"
                        />
                    </div>

                    <div class="column">
                        <BeachBox
                            v-model="beaches"
                            name="curl-curl"
                            display-name="Curl Curl"
                        />
                        <BeachBox
                            v-model="beaches"
                            name="freshwater"
                        />
                        <BeachBox
                            v-model="beaches"
                            name="manly"
                        />
                    </div>
                </div>
                <VuePhoneNumberInput
                    v-model="mobile"
                    dark
                    required
                    default-country-code="AU"
                />
                <button
                    v-if="!isStarted"
                    :disabled="!mobileValid"
                    class="button is-link"
                    @click="submit"
                >
                    Text me!
                </button>
                <div
                    v-if="isSuccess"
                    class="alert success-alert"
                >
                    We'll be in touch 🤙
                </div>
                <div
                    v-if="isError"
                    class="alert error-alert"
                >
                    Error - Sorry something went wrong, please try again later
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import VuePhoneNumberInput from 'vue-phone-number-input';
import BeachBox from './BeachBox.vue';

const apiUrl = 'https://oe8wr7ipkk.execute-api.ap-southeast-2.amazonaws.com/default/surfbutler-signup-parser';
Vue.component('vue-phone-number-input', VuePhoneNumberInput);

export default {
    name: 'LandingPage',
    components: {
        BeachBox,
        VuePhoneNumberInput,
    },
    data: () => ({
        mobile: '',
        isStarted: false,
        isSuccess: false,
        isError: false,
        mobileValid: false,
        beaches: {
            bondi: false,
            tamarama: false,
            bronte: false,
            cronulla: false,
            curlcurl: false,
            freshwater: false,
            manly: false,
        },
    }),
    watch: {
        mobile(val) { this.setEngagement(val); },
    },
    methods: {
        getBeachList(beachesObj) {
            return Object.keys(beachesObj).reduce((list, curr) => {
                if (this.beaches[curr]) list.push(curr);
                return list;
            }, []);
        },
        submit() {
            const beachList = this.getBeachList(this.beaches);

            this.isStarted = true;

            // eslint-disable-next-line no-underscore-dangle
            const countryCode = this.$el.querySelector('#VuePhoneNumberInput_country_selector')._value;
            const mobileNumber = countryCode + this.mobile.replace(/ /g, '');

            axios.post(apiUrl, { phoneNumber: mobileNumber, beaches: beachList }).then(() => {
                this.isSuccess = true;
            }).catch(() => {
                this.isError = true;
            });
        },
        setEngagement(mobile) {
            this.mobileValid = mobile.replace(/ /g, '').length > 8;
        },
    },
};
</script>

<style>
    .panel {
        padding: 40px;
        border-radius: 15px;
        background-color: black;
        width: 380px;
        margin-bottom: 30px;
    }

    .description {
        color: white;
        font-size: 21px;
        margin-bottom: 15px;
    }

    .call-to-action {
        font-size: 14px;
        margin-bottom: 15px;
        font-weight: 800;
        color: #8ac9f9;
    }

    .form {
        display: flex;
        margin-bottom: 1px;
        flex-direction: column;
    }

    .actions button {
        margin-left: 10px;
    }

    @media (max-width: 375px) {
        .header {
            font-size: 70px !important;
        }

        .panel {
            width: 340px !important;
            padding: 20px !important;
        }
    }

    @media (max-width: 320px) {
        .header {
            font-size: 57px !important;
        }

        .panel {
            width: 300px !important;
        }
    }

    /*noinspection CssUnusedSymbol*/
    .vue-phone-number-input {
        margin-bottom: 20px;
    }

    .header {
        color: white;
        font-size: 76px;
        align-self: center;
        border-radius: 10px;
        margin-bottom: 10px;
        font-family: 'Lily Script One', cursive;
    }

    .alert {
        padding: calc(0.375em - 1px) 0.75em;
        text-align: center;
        border-radius: 4px;
        user-select: none;
    }

    .success-alert {
        background-color: #31CF65;
    }

    .error-alert {
        background-color: #ff3860;
    }
</style>
