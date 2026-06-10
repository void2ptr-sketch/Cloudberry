export type ReportPeriod = {
  start: string;
  end: string;
};

export type Report = {
  id: string;
  title: string;
  period: ReportPeriod;
  generatedAt: string;
  totalAmount: number;
  currency: string;
};
