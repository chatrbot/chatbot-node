module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        node: true
    },
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaFeatures: { jsx: true }
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:react/recommended',
        'prettier/react',
        'prettier'
    ],
    rules: {
        'no-unused-vars': 'off',
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'react/display-name': 'off'
    },
    ignorePatterns: ['node_modules', 'postcss.config.js', 'webpack.js']
}
