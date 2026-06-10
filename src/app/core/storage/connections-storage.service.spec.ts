import { ConnectionsStorageService } from './connections-storage.service';

describe('ConnectionsStorageService', () => {
  let service: ConnectionsStorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new ConnectionsStorageService();
  });

  it('persists and loads connections', () => {
    const connections = [
      {
        id: 'c1',
        name: 'AWS',
        provider: 'aws' as const,
        externalAccountId: '111',
      },
    ];
    service.save(connections);
    expect(service.load()).toEqual(connections);
  });

  it('returns empty array when storage is empty', () => {
    expect(service.load()).toEqual([]);
  });
});
