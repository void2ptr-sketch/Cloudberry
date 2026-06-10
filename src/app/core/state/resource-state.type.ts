export type ResourceStatus = 'idle' | 'loading' | 'ready' | 'error';

export type ResourceState = {
  status: ResourceStatus;
  error: string | null;
};

export type AppResourceKey = 'billing' | 'connections' | 'budgets';

export type AppResources = Record<AppResourceKey, ResourceState>;
