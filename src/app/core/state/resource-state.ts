import type { AppResources, ResourceState } from './resource-state.type';

export function idleResourceState(): ResourceState {
  return { status: 'idle', error: null };
}

export function loadingResourceState(): ResourceState {
  return { status: 'loading', error: null };
}

export function readyResourceState(): ResourceState {
  return { status: 'ready', error: null };
}

export function errorResourceState(error: string): ResourceState {
  return { status: 'error', error };
}

export function createIdleResources(): AppResources {
  return {
    billing: idleResourceState(),
    connections: idleResourceState(),
    budgets: idleResourceState(),
  };
}

export function createReadyResources(): AppResources {
  return {
    billing: readyResourceState(),
    connections: readyResourceState(),
    budgets: readyResourceState(),
  };
}
