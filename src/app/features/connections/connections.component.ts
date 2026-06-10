import { Component, inject, OnInit, signal } from '@angular/core';

import {
  CLOUD_PROVIDER_LABELS,
  type CloudConnection,
  type CloudConnectionInput,
} from '../../core/domain';
import { AppStore } from '../../core/state';
import { UiTranslatePipe, UiTranslateService } from '../../shared/ui-locale';
import { ConnectionFormComponent } from './connection-form.component';

@Component({
  selector: 'app-connections',
  standalone: true,
  imports: [ConnectionFormComponent, UiTranslatePipe],
  templateUrl: './connections.component.html',
  styleUrl: './connections.component.scss',
})
export class ConnectionsComponent implements OnInit {
  private readonly store = inject(AppStore);
  private readonly translate = inject(UiTranslateService);

  readonly connections = this.store.connections;
  readonly selectedConnectionId = this.store.selectedConnectionId;

  readonly showForm = signal(false);
  readonly editingConnection = signal<CloudConnection | null>(null);

  readonly providerLabels = CLOUD_PROVIDER_LABELS;

  ngOnInit(): void {
    void this.store.loadConnections();
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
    const confirmed = confirm(
      this.translate.t('connections.confirmDelete', { name: connection.name }),
    );
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
