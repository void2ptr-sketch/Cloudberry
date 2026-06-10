import type { Environment } from './environment.model';

/**
 * Default environment (DEV). Replaced at build time via angular.json fileReplacements.
 */
export const environment: Environment = {
  production: false,
  name: 'dev',
  apiUrl: 'http://localhost:3000/api',
  enableDebug: true,
};

export type { Environment, EnvironmentName } from './environment.model';
