import { ReactNode, MouseEvent } from "react";
import "./FormModal.css";

interface FormModalProps {
    /**
     * Controla a abertura do modal.
     */
    open: boolean;

    /**
     * Título exibido no modal.
     */
    title: string;

    /**
     * Conteúdo do formulário.
     */
    children: ReactNode;

    /**
     * Fecha o modal.
     */
    onClose: () => void;

    /**
     * Salva o formulário.
     */
    onSubmit: () => void | Promise<void>;

    /**
     * Texto do botão salvar.
     */
    submitText?: string;

    /**
     * Texto do botão cancelar.
     */
    cancelText?: string;

    /**
     * Estado de carregamento.
     */
    loading?: boolean;

    /**
     * Largura do modal.
     */
    width?: number | string;
}

export default function FormModal({
    open,
    title,
    children,
    onClose,
    onSubmit,
    submitText = "Salvar",
    cancelText = "Cancelar",
    loading = false,
    width = 650,
}: FormModalProps) {
    if (!open) return null;

    function handleOverlayClick() {
        if (!loading) {
            onClose();
        }
    }

    function handleContentClick(
        event: MouseEvent<HTMLDivElement>
    ) {
        event.stopPropagation();
    }

    async function handleSubmit() {
        await onSubmit();
    }

    return (
        <div
            className="form-modal-overlay"
            onClick={handleOverlayClick}
        >
            <div
                className="form-modal"
                style={{
                    width:
                        typeof width === "number"
                            ? `${width}px`
                            : width,
                }}
                onClick={handleContentClick}
            >
                {/* Cabeçalho */}

                <div className="form-modal-header">

                    <h2>{title}</h2>

                    <button
                        type="button"
                        className="form-modal-close"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ✕
                    </button>

                </div>

                {/* Conteúdo */}

                <div className="form-modal-body">
                    {children}
                </div>

                {/* Rodapé */}

                <div className="form-modal-footer">

                    <button
                        type="button"
                        className="form-modal-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="form-modal-submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Salvando..."
                            : submitText}
                    </button>

                </div>

            </div>
        </div>
    );
}