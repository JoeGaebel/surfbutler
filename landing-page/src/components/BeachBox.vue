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
    }
</style>
