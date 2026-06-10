export type CostRecord = {
  id: string;
  connectionId: string;
  service: string;
  amount: number;
  currency: string;
  usageDate: string;
  costCenterId?: string;
};
