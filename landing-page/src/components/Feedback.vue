<template>
    <div id="feedback">
        <iframe :src="iframeSrc">Loading...</iframe>
    </div>
</template>

<script>
const iframeSrc = 'https://docs.google.com/forms/d/e/'
        + '1FAIpQLSeFMkGUjPhDDfXkuVLYK3vY8J9q7kT989V4m-odf8ed0JbQeg/viewform?embedded=true';

export default {
    data: () => ({ iframeSrc }),
};
</script>

<style scoped>
    #feedback {
        margin-top: 2rem;
        width: 500px;
        height: 89vh;
    }

    iframe {
        height: 100%;
        width: 100%;
    }

    @media (max-width: 500px) {
        #feedback {
            height: 101vh;
            width: 100vw;
            margin: 0.5rem 0;
        }
    }
</style>
