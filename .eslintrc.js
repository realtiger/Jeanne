const prettierConfig = require('./.prettierrc.js');

module.exports = {
    root: true,
    ignorePatterns: ['projects/**/*'],
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ['tsconfig.json'],
                createDefaultProgram: true,
                ecmaVersion: 'latest'
            },
            plugins: ['@typescript-eslint', 'import'],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@angular-eslint/recommended',
                'plugin:@angular-eslint/template/process-inline-templates',
                'plugin:prettier/recommended',
                'prettier'
            ],
            rules: {
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        type: 'attribute',
                        prefix: 'app',
                        style: 'camelCase'
                    }
                ],
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        type: 'element',
                        prefix: 'app',
                        style: 'kebab-case'
                    }
                ],
                '@typescript-eslint/array-type': [
                    'error',
                    {
                        default: 'array-simple'
                    }
                ],
                '@typescript-eslint/ban-types': [
                    'off',
                    {
                        types: {
                            String: {
                                message: 'Use string instead.'
                            },
                            Number: {
                                message: 'Use number instead.'
                            },
                            Boolean: {
                                message: 'Use boolean instead.'
                            },
                            Function: {
                                message: 'Use specific callable interface instead.'
                            }
                        }
                    }
                ],
                '@typescript-eslint/no-this-alias': 'error',
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern: '^_'
                    }
                ],
                'import/no-duplicates': 'error',
                'import/no-unused-modules': 'error',
                'import/no-unassigned-import': 'error',
                'import/order': [
                    'error',
                    {
                        alphabetize: { order: 'asc', caseInsensitive: false },
                        'newlines-between': 'always',
                        groups: ['external', 'internal', ['parent', 'sibling', 'index']],
                        pathGroups: [],
                        pathGroupsExcludedImportTypes: []
                    }
                ],
                'prettier/prettier': ['error', prettierConfig],
                'no-irregular-whitespace': 'error',
                'no-multiple-empty-lines': 'error',
                'no-sparse-arrays': 'error',
                'prefer-object-spread': 'error',
                'prefer-template': 'error'
            }
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended', 'plugin:@angular-eslint/template/accessibility', 'plugin:prettier/recommended', 'prettier'],
            rules: {}
        }
    ]
};
