import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import {
  CLOUD_PROVIDER_LABELS,
  type CloudConnection,
  type CloudConnectionInput,
} from '../../core/domain';
import { AppStore } from '../../core/state';
import { createPaginationState, UiPaginationComponent } from '../../shared/pagination';
import { UiResourceStatusComponent } from '../../shared/ui-resource-status';
import { ConnectionFormComponent } from './connection-form.component';

@Component({
    selector: 'app-connections',
    imports: [
        ConnectionFormComponent,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        UiPaginationComponent,
        UiResourceStatusComponent,
    ],
    templateUrl: './connections.component.html',
    styleUrl: './connections.component.scss'
})
export class ConnectionsComponent implements OnInit {
  private readonly store = inject(AppStore);
  private readonly pagination = createPaginationState({
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 25],
  });

  readonly connections = this.store.connections;
  readonly connectionsState = this.store.connectionsState;
  readonly selectedConnectionId = this.store.selectedConnectionId;

  readonly showForm = signal(false);
  readonly editingConnection = signal<CloudConnection | null>(null);

  readonly paginatedConnections = this.pagination.createSlice(this.connections);
  readonly pageIndex = this.pagination.pageIndex;
  readonly pageSize = this.pagination.pageSize;
  readonly pageSizeOptions = this.pagination.pageSizeOptions;
  readonly onPageChange = this.pagination.onPageChange;

  readonly providerLabels = CLOUD_PROVIDER_LABELS;

  constructor() {
    this.pagination.bindItemCount(computed(() => this.connections().length));
  }

  ngOnInit(): void {
    void this.store.loadConnections();
  }

  retryConnectionsLoad(): void {
    this.store.retryConnectionsLoad();
  }

  openCreateForm(): void {
    this.editingConnection.set(null);
    this.showForm.set(true);
  }

  openEditForm(connection: CloudConnection): void {
    this.editingConnection.set(connection);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingConnection.set(null);
  }

  onFormSaved(input: CloudConnectionInput): void {
    const editing = this.editingConnection();
    if (editing) {
      this.store.updateConnection(editing.id, input);
    } else {
      this.store.addConnection(input);
    }
    this.closeForm();
  }

  removeConnection(connection: CloudConnection): void {
    const name = connection.name;
    const confirmed = confirm($localize`:@@connections.confirmDelete:Удалить подключение «${name}»?`);
    if (!confirmed) {
      return;
    }
    this.store.removeConnection(connection.id);
    if (this.editingConnection()?.id === connection.id) {
      this.closeForm();
    }
  }

  selectConnection(connection: CloudConnection): void {
    this.store.selectConnection(connection.id);
  }

  clearSelection(): void {
    this.store.selectConnection(null);
  }

  providerLabel(provider: CloudConnection['provider']): string {
    return this.providerLabels[provider];
  }

  isSelected(connection: CloudConnection): boolean {
    return this.selectedConnectionId() === connection.id;
  }
}
