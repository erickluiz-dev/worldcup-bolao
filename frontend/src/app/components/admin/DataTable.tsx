import React from "react";

import "./DataTable.css";

export interface DataTableColumn<T> {
    /**
     * Nome da propriedade do objeto.
     */
    key: keyof T;

    /**
     * Título exibido na coluna.
     */
    title: string;

    /**
     * Permite renderização personalizada.
     */
    render?: (value: unknown, row: T) => React.ReactNode;

    /**
     * Alinhamento da coluna.
     */
    align?: "left" | "center" | "right";

    /**
     * Largura da coluna.
     */
    width?: string | number;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];

    data: T[];

    loading?: boolean;

    emptyMessage?: string;

    onEdit?: (row: T) => void;

    onDelete?: (row: T) => void;

    getRowKey: (row: T) => string | number;
}

export default function DataTable<T>({
    columns,
    data,
    loading = false,
    emptyMessage = "Nenhum registro encontrado.",
    onEdit,
    onDelete,
    getRowKey,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="datatable-loading">
                Carregando...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="datatable-empty">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="datatable-container">
            <table className="datatable">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                style={{
                                    textAlign:
                                        column.align ??
                                        "left",
                                    width: column.width,
                                }}
                            >
                                {column.title}
                            </th>
                        ))}

                        {(onEdit || onDelete) && (
                            <th
                                style={{
                                    width: 150,
                                    textAlign: "center",
                                }}
                            >
                                Ações
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row) => (
                        <tr
                            key={getRowKey(row)}
                        >
                            {columns.map(
                                (column) => (
                                    <td
                                        key={String(
                                            column.key
                                        )}
                                        style={{
                                            textAlign:
                                                column.align ??
                                                "left",
                                        }}
                                    >
                                        {column.render
                                            ? column.render(
                                                  row[
                                                      column
                                                          .key
                                                  ],
                                                  row
                                              )
                                            : String(
                                                  row[
                                                      column
                                                          .key
                                                  ] ??
                                                      ""
                                              )}
                                    </td>
                                )
                            )}

                            {(onEdit ||
                                onDelete) && (
                                <td className="datatable-actions">
                                    {onEdit && (
                                        <button
                                            className="datatable-edit"
                                            onClick={() =>
                                                onEdit(
                                                    row
                                                )
                                            }
                                        >
                                            Editar
                                        </button>
                                    )}

                                    {onDelete && (
                                        <button
                                            className="datatable-delete"
                                            onClick={() =>
                                                onDelete(
                                                    row
                                                )
                                            }
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}