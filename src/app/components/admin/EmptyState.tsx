import { ReactNode } from "react";
import "./EmptyState.css";

interface EmptyStateProps {
    /**
     * Emoji ou ícone exibido acima da mensagem.
     */
    icon?: ReactNode;

    /**
     * Título principal.
     */
    title: string;

    /**
     * Texto auxiliar.
     */
    description?: string;

    /**
     * Botão ou ação opcional.
     */
    action?: ReactNode;
}

export default function EmptyState({
    icon = "📂",
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="empty-state">

            <div className="empty-state-icon">
                {icon}
            </div>

            <h2 className="empty-state-title">
                {title}
            </h2>

            {description && (
                <p className="empty-state-description">
                    {description}
                </p>
            )}

            {action && (
                <div className="empty-state-action">
                    {action}
                </div>
            )}

        </div>
    );
}