import { ReactNode } from "react";

import "./PageHeader.css";

interface PageHeaderProps {
    /**
     * Título principal da página.
     */
    title: string;

    /**
     * Subtítulo opcional.
     */
    subtitle?: string;

    /**
     * Conteúdo exibido à direita.
     * Ex.: botão "Novo", filtros, pesquisa...
     */
    actions?: ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    actions,
}: PageHeaderProps) {
    return (
        <header className="page-header">

            <div className="page-header-info">

                <h1 className="page-header-title">
                    {title}
                </h1>

                {subtitle && (
                    <p className="page-header-subtitle">
                        {subtitle}
                    </p>
                )}

            </div>

            {actions && (
                <div className="page-header-actions">
                    {actions}
                </div>
            )}

        </header>
    );
}