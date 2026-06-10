import {
  createIdleResources,
  createReadyResources,
  errorResourceState,
  loadingResourceState,
  readyResourceState,
} from './resource-state';

describe('resource-state', () => {
  it('creates idle resources for all keys', () => {
    const resources = createIdleResources();
    expect(resources.billing.status).toBe('idle');
    expect(resources.connections.status).toBe('idle');
    expect(resources.budgets.status).toBe('idle');
  });

  it('creates ready resources for all keys', () => {
    const resources = createReadyResources();
    expect(resources.billing.status).toBe('ready');
    expect(resources.connections.error).toBeNull();
  });

  it('builds error state with message', () => {
    const state = errorResourceState('Failed');
    expect(state.status).toBe('error');
    expect(state.error).toBe('Failed');
  });

  it('builds loading state without error', () => {
    expect(loadingResourceState()).toEqual({ status: 'loading', error: null });
  });
});
