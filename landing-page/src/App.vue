<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style>
    body {
        background-position-x: 79%;
        background-size: cover;
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

    html {
        min-width: unset !important;
        overflow-y: hidden;
        background-color: unset !important;
    }
</style>
