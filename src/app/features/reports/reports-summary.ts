import type { CloudConnection, CloudProviderId, CostCenter, CostRecord } from '../../core/domain';

export type ReportAmountRow = {
  key: string;
  label: string;
  amount: number;
};

export function buildProviderReport(
  connections: CloudConnection[],
  records: CostRecord[],
  providerLabels: Record<CloudProviderId, string>,
): ReportAmountRow[] {
  const connectionProvider = new Map(connections.map((item) => [item.id, item.provider]));
  const totals = new Map<CloudProviderId, number>();

  for (const record of records) {
    const provider = connectionProvider.get(record.connectionId) ?? 'other';
    totals.set(provider, (totals.get(provider) ?? 0) + record.amount);
  }

  return [...totals.entries()]
    .map(([provider, amount]) => ({
      key: provider,
      label: providerLabels[provider],
      amount,
    }))
    .sort((left, right) => right.amount - left.amount);
}

export function buildServiceReport(records: CostRecord[]): ReportAmountRow[] {
  const totals = new Map<string, number>();

  for (const record of records) {
    totals.set(record.service, (totals.get(record.service) ?? 0) + record.amount);
  }

  return [...totals.entries()]
    .map(([service, amount]) => ({
      key: service,
      label: service,
      amount,
    }))
    .sort((left, right) => right.amount - left.amount);
}

export function buildTagsReport(
  costCenters: CostCenter[],
  records: CostRecord[],
  untaggedLabel: string,
): ReportAmountRow[] {
  const centerNameById = new Map(costCenters.map((item) => [item.id, item.name]));
  const totals = new Map<string, { label: string; amount: number }>();

  for (const record of records) {
    const key = record.costCenterId ?? 'untagged';
    const label =
      record.costCenterId === undefined
        ? untaggedLabel
        : (centerNameById.get(record.costCenterId) ?? record.costCenterId);
    const current = totals.get(key) ?? { label, amount: 0 };
    totals.set(key, { label: current.label, amount: current.amount + record.amount });
  }

  return [...totals.entries()]
    .map(([key, value]) => ({
      key,
      label: value.label,
      amount: value.amount,
    }))
    .sort((left, right) => right.amount - left.amount);
}
