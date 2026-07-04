import { ReactNode } from "react";
import "./ConfirmDialog.css";


interface ConfirmDialogProps {
    /**
     * Controla a exibição do diálogo.
     */
    open: boolean;

    /**
     * Título do diálogo.
     */
    title: string;

    /**
     * Mensagem de confirmação.
     */
    message: string;

    /**
     * Texto do botão de confirmação.
     */
    confirmText?: string;

    /**
     * Texto do botão de cancelamento.
     */
    cancelText?: string;

    /**
     * Ícone exibido no topo.
     */
    icon?: ReactNode;

    /**
     * Cor do botão principal.
     */
    variant?: "danger" | "warning" | "primary";

    /**
     * Callback ao cancelar.
     */
    onCancel: () => void;

    /**
     * Callback ao confirmar.
     */
    onConfirm: () => void;

    /**
     * Estado de carregamento.
     */
    loading?: boolean;
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    icon = "⚠️",
    variant = "danger",
    onCancel,
    onConfirm,
    loading = false,
}: ConfirmDialogProps) {
    if (!open) return null;


    return (
        <div 
            className="confirm-dialog-overlay"
            onClick={!loading ? onCancel : undefined}
        >

            <div className="confirm-dialog">

                <div className="confirm-dialog-icon">
                    {icon}
                </div>

                <h2 className="confirm-dialog-title">
                    {title}
                </h2>

                <p className="confirm-dialog-message">
                    {message}
                </p>

                <div className="confirm-dialog-actions">

                    <button
                        type="button"
                        className="confirm-dialog-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className={`confirm-dialog-confirm ${variant}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Processando..."
                            : confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}