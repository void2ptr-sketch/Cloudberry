export type EnvironmentName = 'dev' | 'test' | 'prod';

export type Environment = {
  production: boolean;
  name: EnvironmentName;
  apiUrl: string;
  enableDebug: boolean;
};
