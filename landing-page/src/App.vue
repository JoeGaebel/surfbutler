<template>
    <div id="app">
        <div class="header">
            Surf Butler
        </div>
        <div class="panel">
            <div class="sub-title">
                Surf's Up!
            </div>
            <div class="description">
                Want to know when your beaches are pumping?
                Get a text the night before from Surf Bulter.
            </div>
            <div class="call-to-action">
                Pick your favourite beaches and enter your mobile
                number to receive free updates!
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
                    class="button is-link"
                    @click="submit"
                >
                    Let's go!
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import VuePhoneNumberInput from 'vue-phone-number-input';
import BeachBox from './components/BeachBox.vue';

const apiUrl = 'https://5h7fqfsyik.execute-api.ap-southeast-2.amazonaws.com/default/surf-butler-landing-page-data-parser';
Vue.component('vue-phone-number-input', VuePhoneNumberInput);

export default {
    name: 'App',
    components: {
        BeachBox,
        VuePhoneNumberInput,
    },
    data: () => ({
        mobile: '',
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
    methods: {
        submit() {
            const beachList = Object.keys(this.beaches).reduce((list, curr) => {
                if (this.beaches[curr]) list.push(curr);
                return list;
            }, []);

            axios.post(apiUrl, { phoneNumber: this.mobile.replace(/ /g, ''), beaches: beachList });
        },
    },
};
</script>

<style>
    body {
        padding: 10px;
        background-position-x: 79%;
        background-size: auto;
        background: url('./assets/background.jpg') no-repeat fixed 79% 0;
    }

    #app {
        height: 100vh;
        color: white;
        display: flex;
        align-items: center;
        font-family: "Montserrat", sans-serif;
        flex-direction: column;
    }

    .panel {
        padding: 40px;
        border-radius: 15px;
        background-color: black;
        width: 380px;
        margin-bottom: 30px;
    }

    .sub-title {
        color: white;
        font-size: 42px;
        margin-bottom: 0;
    }

    .description {
        color: #656565;
        font-size: 21px;
        margin-bottom: 15px;
    }

    .call-to-action {
        font-size: 14px;
        margin-bottom: 15px;
    }

    .form {
        display: flex;
        margin-bottom: 1px;
        flex-direction: column;
    }

    .actions button {
        margin-left: 10px;
    }

    .checkbox:hover {
        color: cornflowerblue !important;
    }

    html {
        background-color: unset !important;
    }

    @media (max-width: 375px) {
        .header {
            font-size: 73px !important;
            margin-bottom: 0 !important;
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

        .sub-title {
            font-size: 34px;
        }
    }

    label.checkbox {
        margin-right: 10px;
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
        margin-bottom: 25px;
        font-family: 'Lily Script One', cursive;
    }
</style>
