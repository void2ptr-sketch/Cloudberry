// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

const rxjsRestrictedImports = {
  paths: [
    {
      name: 'rxjs',
      message: 'Use AppStore signals. RxJS is allowed only in src/app/core/api (HTTP/WebSocket).',
    },
    {
      name: 'rxjs/operators',
      message: 'rxjs/operators is allowed only in src/app/core/api.',
    },
  ],
};

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
  {
    files: ['src/**/*.ts'],
    ignores: ['src/app/core/api/**', 'src/app/core/http/**'],
    rules: {
      'no-restricted-imports': ['error', rxjsRestrictedImports],
    },
  },
  eslintConfigPrettier,
]);
