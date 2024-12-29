import { Logger } from './logger';
import { ModalManager } from './modal-manager';
import { WidgetStateManager } from './state';
import { submitFeedback } from './api';

export class Widget {
  private formId: string;
  private modal: ModalManager;
  private stateManager: WidgetStateManager;

  constructor(formId: string) {
    this.formId = formId;
    this.modal = new ModalManager();
    this.stateManager = WidgetStateManager.getInstance();
  }

  init() {
    Logger.debug('Initializing widget');
    
    const trigger = document.getElementById(`userbird-trigger-${this.formId}`);
    if (!trigger) {
      Logger.error('Trigger element not found');
      return;
    }

    this.setupEventListeners(trigger);
  }

  private setupEventListeners(trigger: HTMLElement) {
    // Trigger click
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modal.open(trigger);
    });

    // Close handlers
    this.modal.onClose(() => this.modal.close());

    // Submit handler
    this.modal.onSubmit(async () => {
      const message = this.modal.getMessage();
      if (!message) return;

      this.modal.setSubmitting(true);
      
      try {
        await submitFeedback({ formId: this.formId, message });
        this.stateManager.setState('success');
      } catch (error) {
        this.modal.showError(error instanceof Error ? error.message : 'Failed to submit feedback');
        Logger.error('Failed to submit feedback:', error);
      } finally {
        this.modal.setSubmitting(false);
      }
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.modal.close();
      }
    });
  }
}