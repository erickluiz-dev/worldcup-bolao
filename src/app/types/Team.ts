export interface Team {
    /**
     * Identificador.
     */
    id: number;

    /**
     * Nome da seleção.
     */
    name: string;

    /**
     * Grupo.
     */
    group: string;

    /**
     * Código FIFA.
     */
    code: string;

    /**
     * Bandeira.
     */
    flag: string;
}

export type CreateTeamRequest = Omit<Team, "id">;

export type UpdateTeamRequest = Team;