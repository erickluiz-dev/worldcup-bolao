import { authenticatedFetch } from "./authService";
import type {
    Stadium,
    CreateStadiumRequest,
    UpdateStadiumRequest,
} from "../types/Stadium";

const API_URL = "http://localhost:8000/api/stadiums";

/* ==========================================================
 * Listar Estádios
 * ========================================================== */

export async function getStadiums(): Promise<Stadium[]> {
    const response = await authenticatedFetch(API_URL);

    if (!response.ok) {
        throw new Error("Erro ao carregar estádios.");
    }

    return await response.json();
}

/* ==========================================================
 * Buscar Estádio por ID
 * ========================================================== */

export async function getStadiumById(
    id: number
): Promise<Stadium> {
    const response = await authenticatedFetch(
        `${API_URL}/${id}`
    );

    if (!response.ok) {
        throw new Error("Estádio não encontrado.");
    }

    return await response.json();
}

/* ==========================================================
 * Cadastrar Estádio
 * ========================================================== */

export async function createStadium(
    stadium: CreateStadiumRequest
): Promise<Stadium> {
    const response = await authenticatedFetch(API_URL, {
        method: "POST",
        body: JSON.stringify(stadium),
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ??
                "Erro ao cadastrar estádio."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Atualizar Estádio
 * ========================================================== */

export async function updateStadium(
    stadium: UpdateStadiumRequest
): Promise<Stadium> {
    if (!stadium.id) {
        throw new Error(
            "ID do estádio não informado."
        );
    }

    const response = await authenticatedFetch(
        `${API_URL}/${stadium.id}`,
        {
            method: "PUT",
            body: JSON.stringify(stadium),
        }
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ??
                "Erro ao atualizar estádio."
        );
    }

    return await response.json();
}

/* ==========================================================
 * Excluir Estádio
 * ========================================================== */

export async function deleteStadium(
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
                "Erro ao excluir estádio."
        );
    }
}

/* ==========================================================
 * Pesquisar Estádios
 * ========================================================== */

export async function searchStadiums(
    search: string
): Promise<Stadium[]> {
    const stadiums = await getStadiums();

    if (!search.trim()) {
        return stadiums;
    }

    const query = search.toLowerCase();

    return stadiums.filter(
        (stadium) =>
            stadium.name
                .toLowerCase()
                .includes(query) ||
            stadium.city
                .toLowerCase()
                .includes(query) ||
            stadium.country
                .toLowerCase()
                .includes(query)
    );
}

/* ==========================================================
 * Ordenação
 * ========================================================== */

export function sortStadiums(
    stadiums: Stadium[],
    field: keyof Stadium = "name"
): Stadium[] {
    return [...stadiums].sort((a, b) => {
        const valueA = String(a[field] ?? "").toLowerCase();
        const valueB = String(b[field] ?? "").toLowerCase();

        return valueA.localeCompare(valueB);
    });
}