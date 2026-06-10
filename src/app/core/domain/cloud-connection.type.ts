import type { CloudProviderId } from './cloud-provider.type';

export type CloudConnection = {
  id: string;
  name: string;
  provider: CloudProviderId;
  externalAccountId: string;
};
