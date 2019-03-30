module.exports = {
    root: true,
    env: {
        node: true,
        jest: true,
    },
    extends: [
        'plugin:vue/recommended',
        'eslint:recommended',
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    plugins: [
        'eslint-plugin-vue',
    ],
    rules: {
        'vue/html-indent': ['error', 4],
        'vue/html-closing-bracket-spacing': ['error', { selfClosingTag: 'never' }],
        'vue/require-default-prop': [2],
        indent: [2, 4],
        'quote-props': ['error', 'as-needed'],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
