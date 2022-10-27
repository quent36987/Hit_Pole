// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'standard-with-typescript',
        'plugin:prettier/recommended'
    ],
    overrides: [],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['react'],
    rules: {
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                next: 'return',
                prev: '*'
            },
            {
                blankLine: 'always',
                next: '*',
                prev: 'block-like'
            },
            {
                blankLine: 'always',
                next: 'block-like',
                prev: '*'
            },
            {
                blankLine: 'always',
                next: '*',
                prev: 'multiline-expression'
            },
            {
                blankLine: 'always',
                next: 'multiline-expression',
                prev: '*'
            },
            {
                blankLine: 'always',
                next: '*',
                prev: 'multiline-const'
            },
            {
                blankLine: 'always',
                next: 'multiline-const',
                prev: '*'
            },
            {
                blankLine: 'always',
                next: '*',
                prev: 'multiline-let'
            },
            {
                blankLine: 'always',
                next: 'multiline-let',
                prev: '*'
            }
        ]
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
