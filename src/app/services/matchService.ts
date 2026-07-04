import { authenticatedFetch } from "./authService";

import type {
    Match,
    MatchFilters,
    MatchResult,
    CreateMatchRequest,
    UpdateMatchRequest,
} from "../types/Match";

const API_URL = "http://localhost:8000/api/matches";

/* ==========================================================
 * Listar Partidas
 * ========================================================== */

export async function getMatches(): Promise<Match[]> {

    const response = await authenticatedFetch(API_URL);

    if (!response.ok) {
        throw new Error("Erro ao carregar partidas.");
    }

    return await response.json();
}

/* ==========================================================
 * Buscar Partida por ID
 * ========================================================== */

export async function getMatchById(
    id: number
): Promise<Match> {

    const response = await authenticatedFetch(
        `${API_URL}/${id}`
    );

    if (!response.ok) {
        throw new Error("Partida não encontrada.");
    }

    return await response.json();
}

/* ==========================================================
 * Criar Partida
 * ========================================================== */

export async function createMatch(
    match: CreateMatchRequest
): Promise<Match> {

    const response = await authenticatedFetch(
        API_URL,
        {
            method: "POST",
            body: JSON.stringify(match),
        }
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            JSON.stringify(error, null, 2)
        );
    }

    return await response.json();
}

/* ==========================================================
 * Atualizar Partida
 * ========================================================== */

export async function updateMatch(
    match: UpdateMatchRequest
): Promise<Match> {

    if (!match.id) {
        throw new Error(
            "ID da partida não informado."
        );
    }

    const response = await authenticatedFetch(
        `${API_URL}/${match.id}`,
        {
            method: "PUT",
            body: JSON.stringify(match),
        }
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.detail ??
            "Erro ao atualizar partida."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Excluir Partida
 * ========================================================== */

export async function deleteMatch(
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
            "Erro ao excluir partida."
        );
    }
}

/* ==========================================================
 * Publicar Resultado
 * ========================================================== */

export async function publishResult(
    matchId: number,
    result: MatchResult
): Promise<Match> {

    const response = await authenticatedFetch(
        `${API_URL}/${matchId}/result`,
        {
            method: "PATCH",
            body: JSON.stringify(result),
        }
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.detail ??
            "Erro ao publicar resultado."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Pesquisar Partidas
 * ========================================================== */

export async function searchMatches(
    search: string
): Promise<Match[]> {

    const matches = await getMatches();

    if (!search.trim()) {
        return matches;
    }

    const query = search.toLowerCase();

    return matches.filter((match) => {

        const home =
            match.home_team?.name
                ?.toLowerCase() ?? "";

        const away =
            match.away_team?.name
                ?.toLowerCase() ?? "";

        const stadium =
            match.stadium?.name
                ?.toLowerCase() ?? "";

        return (
            home.includes(query) ||
            away.includes(query) ||
            stadium.includes(query) ||
            match.stage
                .toLowerCase()
                .includes(query) ||
            (match.group ?? "")
                .toLowerCase()
                .includes(query)
        );

    });

}

/* ==========================================================
 * Filtrar Partidas
 * ========================================================== */

export function filterMatches(
    matches: Match[],
    filters: MatchFilters
): Match[] {

    return matches.filter((match) => {

        if (
            filters.stage &&
            match.stage !== filters.stage
        ) {
            return false;
        }

        if (
            filters.group &&
            match.group !== filters.group
        ) {
            return false;
        }

        if (
            filters.round &&
            match.round !== filters.round
        ) {
            return false;
        }

        if (
            filters.stadium_id &&
            match.stadium_id !== filters.stadium_id
        ) {
            return false;
        }

        if (
            filters.team_id &&
            match.home_team_id !== filters.team_id &&
            match.away_team_id !== filters.team_id
        ) {
            return false;
        }

        if (
            filters.finished !== undefined &&
            match.finished !== filters.finished
        ) {
            return false;
        }

        return true;

    });

}

/* ==========================================================
 * Ordenação
 * ========================================================== */

export function sortMatches(
    matches: Match[]
): Match[] {

    return [...matches].sort((a, b) => {

        return (
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        );

    });

}