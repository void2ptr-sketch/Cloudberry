import type { AppState } from './app-state.model';
import type { Budget, CloudConnection, CostCenter, CostRecord } from '../domain';
import { createInitialAppState } from './app-state.initial';
import { createReadyResources } from './resource-state';

type MockCostRecordInput = {
  id: string;
  connectionId: string;
  service: string;
  amount: number;
  dayOffset: number;
  costCenterId?: string;
};

/** Seed data for DEV/TEST when `environment.enableDebug` is true. */
export function createMockAppState(): AppState {
  const base = createInitialAppState();
  const { start, end } = base.reportingPeriod;

  const connections: CloudConnection[] = [
    {
      id: 'conn-aws-1',
      name: 'AWS Production',
      provider: 'aws',
      externalAccountId: '123456789012',
    },
    {
      id: 'conn-azure-1',
      name: 'Azure Shared',
      provider: 'azure',
      externalAccountId: 'sub-aaaa-bbbb',
    },
    {
      id: 'conn-gcp-1',
      name: 'GCP Analytics',
      provider: 'gcp',
      externalAccountId: 'gcp-project-analytics',
    },
    {
      id: 'conn-oci-1',
      name: 'Oracle ERP',
      provider: 'oci',
      externalAccountId: 'ocid1.tenancy.oci',
    },
    {
      id: 'conn-ibm-1',
      name: 'IBM Legacy',
      provider: 'ibm',
      externalAccountId: 'ibm-account-4421',
    },
    {
      id: 'conn-alibaba-1',
      name: 'Alibaba APAC',
      provider: 'alibaba',
      externalAccountId: 'ali-uid-918273',
    },
    {
      id: 'conn-yandex-1',
      name: 'Yandex RU',
      provider: 'yandex',
      externalAccountId: 'yc-folder-prod',
    },
    {
      id: 'conn-do-1',
      name: 'DigitalOcean Apps',
      provider: 'digitalocean',
      externalAccountId: 'do-team-apps',
    },
    {
      id: 'conn-hetzner-1',
      name: 'Hetzner EU',
      provider: 'hetzner',
      externalAccountId: 'hz-project-eu',
    },
    {
      id: 'conn-cf-1',
      name: 'Cloudflare Edge',
      provider: 'cloudflare',
      externalAccountId: 'cf-account-edge',
    },
  ];

  const costCenters: CostCenter[] = [
    { id: 'cc-platform', name: 'Platform' },
    { id: 'cc-product', name: 'Product' },
    { id: 'cc-data', name: 'Data Engineering' },
    { id: 'cc-security', name: 'Security' },
    { id: 'cc-sandbox', name: 'Sandbox' },
    { id: 'cc-marketing', name: 'Marketing' },
    { id: 'cc-ml', name: 'ML Research' },
    { id: 'cc-devops', name: 'DevOps' },
    { id: 'cc-finance', name: 'Finance' },
  ];

  const costRecordInputs: MockCostRecordInput[] = [
    {
      id: 'cost-1',
      connectionId: 'conn-aws-1',
      service: 'Amazon EC2',
      amount: 1240.5,
      dayOffset: 1,
      costCenterId: 'cc-platform',
    },
    {
      id: 'cost-2',
      connectionId: 'conn-aws-1',
      service: 'Amazon S3',
      amount: 318.2,
      dayOffset: 8,
      costCenterId: 'cc-product',
    },
    {
      id: 'cost-3',
      connectionId: 'conn-aws-1',
      service: 'AWS Lambda',
      amount: 86.4,
      dayOffset: 14,
      costCenterId: 'cc-devops',
    },
    {
      id: 'cost-4',
      connectionId: 'conn-aws-1',
      service: 'Amazon RDS',
      amount: 542.9,
      dayOffset: 22,
      costCenterId: 'cc-data',
    },
    {
      id: 'cost-5',
      connectionId: 'conn-azure-1',
      service: 'Azure Kubernetes Service',
      amount: 890.0,
      dayOffset: 3,
      costCenterId: 'cc-platform',
    },
    {
      id: 'cost-6',
      connectionId: 'conn-azure-1',
      service: 'Azure SQL Database',
      amount: 412.75,
      dayOffset: 11,
      costCenterId: 'cc-data',
    },
    {
      id: 'cost-7',
      connectionId: 'conn-azure-1',
      service: 'Azure Blob Storage',
      amount: 167.3,
      dayOffset: 18,
      costCenterId: 'cc-finance',
    },
    {
      id: 'cost-8',
      connectionId: 'conn-azure-1',
      service: 'Azure Cognitive Services',
      amount: 239.6,
      dayOffset: 26,
      costCenterId: 'cc-ml',
    },
    {
      id: 'cost-9',
      connectionId: 'conn-gcp-1',
      service: 'BigQuery',
      amount: 756.4,
      dayOffset: 2,
      costCenterId: 'cc-data',
    },
    {
      id: 'cost-10',
      connectionId: 'conn-gcp-1',
      service: 'Cloud Run',
      amount: 189.3,
      dayOffset: 9,
      costCenterId: 'cc-product',
    },
    {
      id: 'cost-11',
      connectionId: 'conn-gcp-1',
      service: 'Vertex AI',
      amount: 431.8,
      dayOffset: 16,
      costCenterId: 'cc-ml',
    },
    {
      id: 'cost-12',
      connectionId: 'conn-gcp-1',
      service: 'Cloud Storage',
      amount: 94.15,
      dayOffset: 24,
      costCenterId: 'cc-marketing',
    },
    {
      id: 'cost-13',
      connectionId: 'conn-oci-1',
      service: 'OCI Compute',
      amount: 623.0,
      dayOffset: 4,
      costCenterId: 'cc-platform',
    },
    {
      id: 'cost-14',
      connectionId: 'conn-oci-1',
      service: 'OCI Object Storage',
      amount: 97.5,
      dayOffset: 12,
      costCenterId: 'cc-data',
    },
    {
      id: 'cost-15',
      connectionId: 'conn-oci-1',
      service: 'OCI Autonomous Database',
      amount: 388.2,
      dayOffset: 19,
      costCenterId: 'cc-finance',
    },
    {
      id: 'cost-16',
      connectionId: 'conn-oci-1',
      service: 'OCI Load Balancer',
      amount: 71.4,
      dayOffset: 27,
      costCenterId: 'cc-devops',
    },
    {
      id: 'cost-17',
      connectionId: 'conn-ibm-1',
      service: 'IBM Cloud Kubernetes Service',
      amount: 384.6,
      dayOffset: 5,
      costCenterId: 'cc-security',
    },
    {
      id: 'cost-18',
      connectionId: 'conn-ibm-1',
      service: 'IBM Db2',
      amount: 211.2,
      dayOffset: 13,
      costCenterId: 'cc-product',
    },
    {
      id: 'cost-19',
      connectionId: 'conn-ibm-1',
      service: 'IBM Watson',
      amount: 298.7,
      dayOffset: 20,
      costCenterId: 'cc-ml',
    },
    {
      id: 'cost-20',
      connectionId: 'conn-ibm-1',
      service: 'IBM Cloud Logs',
      amount: 56.9,
      dayOffset: 28,
    },
    {
      id: 'cost-21',
      connectionId: 'conn-alibaba-1',
      service: 'Elastic Compute Service',
      amount: 528.9,
      dayOffset: 6,
      costCenterId: 'cc-product',
    },
    {
      id: 'cost-22',
      connectionId: 'conn-alibaba-1',
      service: 'Object Storage Service',
      amount: 143.1,
      dayOffset: 10,
      costCenterId: 'cc-data',
    },
    {
      id: 'cost-23',
      connectionId: 'conn-alibaba-1',
      service: 'ApsaraDB for RDS',
      amount: 276.45,
      dayOffset: 17,
      costCenterId: 'cc-platform',
    },
    {
      id: 'cost-24',
      connectionId: 'conn-alibaba-1',
      service: 'CDN',
      amount: 88.3,
      dayOffset: 25,
      costCenterId: 'cc-marketing',
    },
    {
      id: 'cost-25',
      connectionId: 'conn-yandex-1',
      service: 'Yandex Compute Cloud',
      amount: 296.8,
      dayOffset: 7,
      costCenterId: 'cc-platform',
    },
    {
      id: 'cost-26',
      connectionId: 'conn-yandex-1',
      service: 'Yandex Managed PostgreSQL',
      amount: 154.4,
      dayOffset: 15,
      costCenterId: 'cc-security',
    },
    {
      id: 'cost-27',
      connectionId: 'conn-yandex-1',
      service: 'Yandex Object Storage',
      amount: 67.2,
      dayOffset: 21,
      costCenterId: 'cc-data',
    },
    {
      id: 'cost-28',
      connectionId: 'conn-yandex-1',
      service: 'Yandex Data Proc',
      amount: 189.5,
      dayOffset: 29,
      costCenterId: 'cc-ml',
    },
    {
      id: 'cost-29',
      connectionId: 'conn-do-1',
      service: 'Droplets',
      amount: 128.0,
      dayOffset: 3,
      costCenterId: 'cc-sandbox',
    },
    {
      id: 'cost-30',
      connectionId: 'conn-do-1',
      service: 'Managed Databases',
      amount: 64.5,
      dayOffset: 11,
      costCenterId: 'cc-devops',
    },
    {
      id: 'cost-31',
      connectionId: 'conn-do-1',
      service: 'Kubernetes',
      amount: 92.8,
      dayOffset: 18,
      costCenterId: 'cc-product',
    },
    {
      id: 'cost-32',
      connectionId: 'conn-do-1',
      service: 'Spaces Object Storage',
      amount: 31.6,
      dayOffset: 26,
    },
    {
      id: 'cost-33',
      connectionId: 'conn-hetzner-1',
      service: 'Cloud Servers',
      amount: 102.3,
      dayOffset: 4,
      costCenterId: 'cc-sandbox',
    },
    {
      id: 'cost-34',
      connectionId: 'conn-hetzner-1',
      service: 'Load Balancers',
      amount: 38.7,
      dayOffset: 12,
      costCenterId: 'cc-platform',
    },
    {
      id: 'cost-35',
      connectionId: 'conn-hetzner-1',
      service: 'Volumes',
      amount: 24.9,
      dayOffset: 19,
      costCenterId: 'cc-devops',
    },
    {
      id: 'cost-36',
      connectionId: 'conn-hetzner-1',
      service: 'Floating IPs',
      amount: 9.8,
      dayOffset: 27,
      costCenterId: 'cc-finance',
    },
    {
      id: 'cost-37',
      connectionId: 'conn-cf-1',
      service: 'Workers',
      amount: 47.2,
      dayOffset: 6,
      costCenterId: 'cc-security',
    },
    {
      id: 'cost-38',
      connectionId: 'conn-cf-1',
      service: 'R2 Storage',
      amount: 22.8,
      dayOffset: 14,
      costCenterId: 'cc-data',
    },
    {
      id: 'cost-39',
      connectionId: 'conn-cf-1',
      service: 'CDN',
      amount: 118.4,
      dayOffset: 20,
      costCenterId: 'cc-marketing',
    },
    {
      id: 'cost-40',
      connectionId: 'conn-cf-1',
      service: 'Zero Trust',
      amount: 76.5,
      dayOffset: 28,
      costCenterId: 'cc-security',
    },
  ];

  const costRecords: CostRecord[] = costRecordInputs.map((record) => ({
    id: record.id,
    connectionId: record.connectionId,
    service: record.service,
    amount: record.amount,
    currency: 'USD',
    usageDate: periodDate(start, record.dayOffset),
    costCenterId: record.costCenterId,
  }));

  const budgets: Budget[] = [
    {
      id: 'budget-1',
      name: 'Organization monthly',
      limitAmount: 12000,
      currency: 'USD',
      periodStart: start,
      periodEnd: end,
      scopeId: 'org-default',
    },
    {
      id: 'budget-2',
      name: 'Platform team',
      limitAmount: 4200,
      currency: 'USD',
      periodStart: start,
      periodEnd: end,
      scopeId: 'cc-platform',
    },
    {
      id: 'budget-3',
      name: 'Data Engineering',
      limitAmount: 2800,
      currency: 'USD',
      periodStart: start,
      periodEnd: end,
      scopeId: 'cc-data',
    },
    {
      id: 'budget-4',
      name: 'ML Research',
      limitAmount: 1500,
      currency: 'USD',
      periodStart: start,
      periodEnd: end,
      scopeId: 'cc-ml',
    },
    {
      id: 'budget-5',
      name: 'Security & compliance',
      limitAmount: 1200,
      currency: 'USD',
      periodStart: start,
      periodEnd: end,
      scopeId: 'cc-security',
    },
  ];

  return {
    ...base,
    resources: createReadyResources(),
    selectedConnectionId: null,
    connections,
    costCenters,
    costRecords,
    budgets,
  };
}

function periodDate(periodStart: string, dayOffset: number): string {
  const [year, month, day] = periodStart.split('-').map(Number);
  const date = new Date(year, month - 1, day + dayOffset);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
