import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmModal = ({ open, onClose, onConfirm, title, message, confirmLabel = 'DELETE', loading = false }) => (
  <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
    <div className="mb-6 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="pt-1 text-sm text-dark-soft">{message}</p>
    </div>
    <div className="flex gap-3">
      <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
        CANCEL
      </Button>
      <Button variant="primary" fullWidth onClick={onConfirm} loading={loading} disabled={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmModal;
