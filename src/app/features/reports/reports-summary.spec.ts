import { buildProviderReport, buildServiceReport, buildTagsReport } from './reports-summary';

describe('reports-summary', () => {
  it('aggregates spend by provider and service', () => {
    const connections = [
      { id: 'c1', name: 'AWS', provider: 'aws' as const, externalAccountId: '1' },
      { id: 'c2', name: 'Azure', provider: 'azure' as const, externalAccountId: '2' },
    ];
    const records = [
      {
        id: '1',
        connectionId: 'c1',
        service: 'EC2',
        amount: 100,
        currency: 'USD',
        usageDate: '2026-06-01',
      },
      {
        id: '2',
        connectionId: 'c2',
        service: 'AKS',
        amount: 40,
        currency: 'USD',
        usageDate: '2026-06-01',
        costCenterId: 'cc-1',
      },
    ];

    expect(
      buildProviderReport(connections, records, {
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
        other: 'Other',
      }),
    ).toEqual([
      { key: 'aws', label: 'AWS', amount: 100 },
      { key: 'azure', label: 'Azure', amount: 40 },
    ]);
    expect(buildServiceReport(records)).toEqual([
      { key: 'EC2', label: 'EC2', amount: 100 },
      { key: 'AKS', label: 'AKS', amount: 40 },
    ]);
    expect(buildTagsReport([{ id: 'cc-1', name: 'Platform' }], records, 'Untagged')).toEqual([
      { key: 'untagged', label: 'Untagged', amount: 100 },
      { key: 'cc-1', label: 'Platform', amount: 40 },
    ]);
  });
});
