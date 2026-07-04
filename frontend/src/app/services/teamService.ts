import { authenticatedFetch } from "./authService";
import type { Team } from "../types/Team";

const API_URL = `${import.meta.env.VITE_API_URL}/teams`;

/* ==========================================================
 * Listar Seleções
 * ========================================================== */

export async function getTeams(): Promise<Team[]> {
    const response = await authenticatedFetch(API_URL);

    if (!response.ok) {
        throw new Error("Erro ao carregar seleções.");
    }

    return await response.json();
}

/* ==========================================================
 * Buscar Seleção por ID
 * ========================================================== */

export async function getTeamById(
    id: number
): Promise<Team> {
    const response = await authenticatedFetch(
        `${API_URL}/${id}`
    );

    if (!response.ok) {
        throw new Error("Seleção não encontrada.");
    }

    return await response.json();
}

/* ==========================================================
 * Cadastrar Seleção
 * ========================================================== */

export async function createTeam(
    team: Team
): Promise<Team> {
    const response = await authenticatedFetch(API_URL, {
        method: "POST",
        body: JSON.stringify(team),
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ??
                "Erro ao cadastrar seleção."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Atualizar Seleção
 * ========================================================== */

export async function updateTeam(
    team: Team
): Promise<Team> {
    if (!team.id) {
        throw new Error(
            "ID da seleção não informado."
        );
    }

    const response = await authenticatedFetch(
        `${API_URL}/${team.id}`,
        {
            method: "PUT",
            body: JSON.stringify(team),
        }
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ??
                "Erro ao atualizar seleção."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Excluir Seleção
 * ========================================================== */

export async function deleteTeam(
    id: number
): Promise<void> {
    const response = await authenticatedFetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ??
                "Erro ao excluir seleção."
        );
    }
}

/* ==========================================================
 * Pesquisar Seleções
 * ========================================================== */

export async function searchTeams(
    search: string
): Promise<Team[]> {
    const teams = await getTeams();

    if (!search.trim()) {
        return teams;
    }

    const query = search.toLowerCase();

    return teams.filter(
        (team) =>
            team.name.toLowerCase().includes(query) ||
            team.code.toLowerCase().includes(query) ||
            team.group.toLowerCase().includes(query)
    );
}