/**
 * Representa um estádio da Copa do Mundo.
 */
export interface Stadium {
    /**
     * Identificador único.
     */
    id?: number;

    /**
     * Nome oficial do estádio.
     */
    name: string;

    /**
     * Cidade onde o estádio está localizado.
     */
    city: string;

    /**
     * País onde o estádio está localizado.
     */
    country: string;    

    /**
     * URL da imagem do estádio.
     */
    image?: string;

    /**
     * Data de criação.
     */
    created_at?: string;

    /**
     * Data da última atualização.
     */
    updated_at?: string;
}

/**
 * Utilizado na criação de um novo estádio.
 */
export type CreateStadiumRequest = Omit<
    Stadium,
    "id" | "created_at" | "updated_at"
>;

/**
 * Utilizado na atualização de um estádio.
 */
export type UpdateStadiumRequest = Stadium;