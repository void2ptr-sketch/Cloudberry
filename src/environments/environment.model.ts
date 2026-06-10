export type EnvironmentName = 'dev' | 'test' | 'prod' | 'lt' | 'preprod';

export type Environment = {
  production: boolean;
  name: EnvironmentName;
  apiUrl: string;
  enableDebug: boolean;
};
