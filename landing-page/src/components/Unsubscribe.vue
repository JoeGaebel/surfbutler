<template>
    <div id="unsubscribe">
        <iframe :src="iframeSrc">Loading...</iframe>
    </div>
</template>

<script>
const iframeSrc = 'https://docs.google.com/forms/d/e/'
        + '1FAIpQLScWUvWgjx7arZVxnk01rThc1uwS6cWMgQZ5kfRiQHBly1MdFg/viewform?embedded=true';

export default {
    data: () => ({ iframeSrc }),
};
</script>

<style scoped>
    #unsubscribe {
        margin-top: 2rem;
        width: 500px;
        height: 89vh;
    }

    iframe {
        height: 100%;
        width: 100%;
    }

    @media (max-width: 500px) {
        #unsubscribe {
            height: 101vh;
            width: 100vw;
            margin: 0.5rem 0;
        }
    }
</style>
