<template>
    <label
        :for="name"
        class="checkbox"
    >
        <input
            :id="name"
            v-model="value[name]"
            :value="name"
            type="checkbox"
            class="checkbox"
        >
        {{ displayName || name }}
    </label>
</template>

<script>
export default {
    props: {
        name: { type: String, required: true },
        value: { type: Object, required: true },
        displayName: { type: String, required: false, default: undefined },
    },
};
</script>

<style scoped>
    label {
        text-transform: capitalize;
        width: 100%;
    }

    @media (max-width: 500px) {
        .checkbox:hover {
            color: white !important;
        }

        .checkbox {
            line-height: 2.25 !important;
        }

        .checkbox input {
            top: 2px !important;
        }
    }

    .checkbox:hover {
        color: cornflowerblue;
    }

    .checkbox {
        line-height: 1.75;
    }

    .checkbox input {
        margin-right: 2px;
        top: -1px;
    }

    label.checkbox {
        margin-right: 10px;
    }
</style>
