'use client';

import { Button } from '@repo/ui/Button';
import { useEffect, useRef } from 'react';

type PrintDialogProps = {
  open: boolean;
  pending: boolean;
  onCancel: () => void;
  onJustPrint: () => void;
  onSaveAndPrint: () => void;
};

export function PrintDialog({
  open,
  pending,
  onCancel,
  onJustPrint,
  onSaveAndPrint,
}: PrintDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-labelledby="print-dialog-title"
      className="print-dialog"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <div className="print-dialog__content">
        <h2 id="print-dialog-title">Print salary receipt</h2>
        <p>Save details in this browser for monthly reuse?</p>
        <div className="print-dialog__actions">
          <Button disabled={pending} type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={pending} type="button" variant="secondary" onClick={onJustPrint}>
            Just Print
          </Button>
          <Button disabled={pending} type="button" onClick={onSaveAndPrint}>
            {pending ? 'Saving…' : 'Save & Print'}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
