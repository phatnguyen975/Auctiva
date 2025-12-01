import { AlertTriangle } from "lucide-react";

interface CancelTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelTransactionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: CancelTransactionModalProps) => {
  // Nếu không mở thì không render gì cả
  if (!isOpen) return null;

  return (
    // 1. Overlay (Lớp phủ đen mờ) - Bấm vào đây thì đóng modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 2. Content Box - Chặn sự kiện click để không bị đóng nhầm */}
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-lg shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Cancel Transaction?</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Canceling this transaction will have the following consequences:
          </p>
        </div>

        {/* Body Content - Warning List */}
        <div className="px-6">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-lg p-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-200">
              <li>
                The winner will be automatically rated{" "}
                <strong className="font-bold">Thumbs Down (-1)</strong> for
                non-compliance.
              </li>
              <li>This transaction will be marked as cancelled.</li>
              <li>You may need to relist the item manually.</li>
            </ul>
          </div>
          <p className="mt-4 text-sm font-medium text-foreground text-center">
            Are you sure you want to proceed?
          </p>
        </div>

        {/* Footer (Buttons) */}
        <div className="p-6 flex justify-end gap-3 bg-gray-50 dark:bg-slate-800/50 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700"
          >
            No, Keep Transaction
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Yes, Cancel Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelTransactionModal;
