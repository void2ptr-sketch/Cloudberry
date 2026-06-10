export type EnvironmentName = 'dev' | 'test' | 'prod' | 'lt';

export type Environment = {
  production: boolean;
  name: EnvironmentName;
  apiUrl: string;
  enableDebug: boolean;
};
