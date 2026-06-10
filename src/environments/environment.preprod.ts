import type { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  name: 'preprod',
  apiUrl: 'https://api.preprod.cloudberry.example/api',
  enableDebug: true,
};
