import type { CloudProviderId } from './cloud-provider.type';

export type CloudConnectionInput = {
  name: string;
  provider: CloudProviderId;
  externalAccountId: string;
};
