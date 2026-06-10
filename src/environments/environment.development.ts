import type { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  name: 'dev',
  apiUrl: 'http://localhost:3000/api',
  enableDebug: true,
};
