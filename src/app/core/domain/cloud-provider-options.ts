import type { CloudProviderId } from './cloud-provider.type';

export type CloudProviderOption = {
  id: CloudProviderId;
  label: string;
};

export const CLOUD_PROVIDER_OPTIONS: CloudProviderOption[] = [
  { id: 'aws', label: 'Amazon Web Services (AWS)' },
  { id: 'azure', label: 'Microsoft Azure' },
  { id: 'gcp', label: 'Google Cloud Platform (GCP)' },
  { id: 'oci', label: 'Oracle Cloud Infrastructure (OCI)' },
  { id: 'ibm', label: 'IBM Cloud' },
  { id: 'alibaba', label: 'Alibaba Cloud' },
  { id: 'yandex', label: 'Yandex Cloud' },
  { id: 'digitalocean', label: 'DigitalOcean' },
  { id: 'hetzner', label: 'Hetzner Cloud' },
  { id: 'openstack', label: 'OpenStack' },
  { id: 'cloudflare', label: 'Cloudflare' },
  { id: 'other', label: 'Другой провайдер' },
];

export const CLOUD_PROVIDER_LABELS: Record<CloudProviderId, string> = {
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  oci: 'Oracle Cloud',
  ibm: 'IBM Cloud',
  alibaba: 'Alibaba Cloud',
  yandex: 'Yandex Cloud',
  digitalocean: 'DigitalOcean',
  hetzner: 'Hetzner',
  openstack: 'OpenStack',
  cloudflare: 'Cloudflare',
  other: 'Другой',
};
