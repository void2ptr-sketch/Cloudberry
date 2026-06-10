import type { CloudProviderId } from './cloud-provider.type';

export type CloudProviderOption = {
  id: CloudProviderId;
  label: string;
};

export const CLOUD_PROVIDER_OPTIONS: CloudProviderOption[] = [
  { id: 'aws', label: 'Amazon Web Services (AWS)' },
  { id: 'azure', label: 'Microsoft Azure' },
  { id: 'gcp', label: 'Google Cloud Platform (GCP)' },
  { id: 'yandex', label: 'Yandex Cloud' },
  { id: 'other', label: 'Другой провайдер' },
];

export const CLOUD_PROVIDER_LABELS: Record<CloudProviderId, string> = {
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  yandex: 'Yandex Cloud',
  other: 'Другой',
};
