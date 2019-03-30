<template>
    <div id="app">
        <div class="panel">
            <div class="header">
                Surf Butler
            </div>
            <div class="sub-title">
                Surfs Up!
            </div>
            <div class="description">
                Want to know when your beach is pumping? Get a text straight to your phone with
                Surf Bulter.
            </div>
            <div class="call-to-action">
                Enter your mobile number to receive text messages for your favourite beach!
            </div>
            <div class="form">
                <div class="checkboxes columns">
                    <div class="column">
                        <label
                            for="bondi"
                            class="checkbox"
                        >
                            <input
                                id="bondi"
                                v-model="beaches"
                                value="bondi"
                                type="checkbox"
                                class="checkbox"
                            >
                            Bondi
                        </label>

                        <label
                            for="tamarama"
                            class="checkbox"
                        >
                            <input
                                id="tamarama"
                                v-model="beaches"
                                type="checkbox"
                                value="tamarama"
                                class="checkbox"
                            >
                            Tamarama
                        </label>

                        <label
                            for="bronte"
                            class="checkbox"
                        >
                            <input
                                id="bronte"
                                v-model="beaches"
                                type="checkbox"
                                value="bronte"
                                class="checkbox"
                            >
                            Bronte
                        </label>

                        <label
                            for="cronulla"
                            class="checkbox"
                        >
                            <input
                                id="cronulla"
                                v-model="beaches"
                                type="checkbox"
                                value="cronulla"
                                class="checkbox"
                            >
                            Cronulla
                        </label>
                    </div>

                    <div class="column">
                        <label
                            for="curl-curl"
                            class="checkbox"
                        >
                            <input
                                id="curl-curl"
                                v-model="beaches"
                                type="checkbox"
                                value="curl-curl"
                                class="checkbox"
                            >
                            Curl Curl
                        </label>

                        <label
                            for="freshwater"
                            class="checkbox"
                        >
                            <input
                                id="freshwater"
                                v-model="beaches"
                                type="checkbox"
                                value="freshwater"
                                class="checkbox"
                            >
                            Freshwater
                        </label>

                        <label
                            for="manly"
                            class="checkbox"
                        >
                            <input
                                id="manly"
                                v-model="beaches"
                                type="checkbox"
                                value="manly"
                                class="checkbox"
                            >
                            Manly
                        </label>
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

const apiUrl = 'https://5h7fqfsyik.execute-api.ap-southeast-2.amazonaws.com/default/surf-butler-landing-page-data-parser';

Vue.component('vue-phone-number-input', VuePhoneNumberInput);

export default {
    name: 'App',
    components: {
        VuePhoneNumberInput,
    },
    data: () => ({
        mobile: '',
        beaches: [],
    }),
    methods: {
        submit() {
            axios.post(apiUrl, {
                phoneNumber: this.mobile.replace(/ /g, ''),
                beaches: this.beaches,
            }, { 'content-type': 'application/json' });
        },
    },
};
</script>

<style>
    body {
        padding: 10px;
        background-position-x: 79%;
        background-size: auto;
        background: transparent url('./assets/background.jpg') no-repeat fixed 79% 0;
    }

    #app {
        height: 97vh;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Montserrat", sans-serif;
    }

    .panel {
        padding: 40px;
        border-radius: 4px;
        background-color: black;
        width: 380px;
    }

    .header {
        font-size: 21px;
        color: #656565;
        margin-bottom: 0;
    }

    .sub-title {
        color: white;
        font-size: 42px;
        margin-bottom: 0;
    }

    .description {
        color: #656565;
        font-size: 21px;
        margin-bottom: 20px;
    }

    .call-to-action {
        font-size: 14px;
        margin-bottom: 10px;
    }

    .form {
        display: flex;
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

    @media (max-width: 384px) {
        #app {
            height: unset;
        }
    }

    label.checkbox {
        margin-right: 10px;
    }

    /*noinspection CssUnusedSymbol*/
    .vue-phone-number-input {
        margin-bottom: 20px;
    }
</style>
