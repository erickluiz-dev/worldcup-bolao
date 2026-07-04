import { authenticatedFetch } from "./authService";

import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
} from "../types/User";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

/* ==========================================================
 * Listar Usuários
 * ========================================================== */

export async function getUsers(): Promise<User[]> {

    const response = await authenticatedFetch(
        API_URL
    );

    if (!response.ok) {

        throw new Error(
            "Erro ao carregar usuários."
        );

    }

    return await response.json();

}

/* ==========================================================
 * Buscar Usuário por ID
 * ========================================================== */

export async function getUserById(
    id: number
): Promise<User> {

    const response = await authenticatedFetch(
        `${API_URL}/${id}`
    );

    if (!response.ok) {

        throw new Error(
            "Usuário não encontrado."
        );

    }

    return await response.json();

}

/* ==========================================================
 * Cadastrar Usuário
 * ========================================================== */

export async function createUser(
    user: CreateUserRequest
): Promise<User> {

    const response = await authenticatedFetch(
        API_URL,
        {
            method: "POST",
            body: JSON.stringify(user),
        }
    );

    if (!response.ok) {

        const error =
            await response.json();

        throw new Error(

            error.detail ??

            "Erro ao cadastrar usuário."

        );

    }

    return await response.json();

}

/* ==========================================================
 * Atualizar Usuário
 * ========================================================== */

export async function updateUser(
    user: UpdateUserRequest
): Promise<User> {

    const response = await authenticatedFetch(

        `${API_URL}/${user.id}`,

        {

            method: "PUT",

            body: JSON.stringify(user),

        }

    );

    if (!response.ok) {

        const error =
            await response.json();

        throw new Error(

            error.detail ??

            "Erro ao atualizar usuário."

        );

    }

    return await response.json();

}

/* ==========================================================
 * Excluir Usuário
 * ========================================================== */

export async function deleteUser(
    id: number
): Promise<void> {

    const response =
        await authenticatedFetch(

            `${API_URL}/${id}`,

            {

                method: "DELETE",

            }

        );

    if (!response.ok) {

        const error =
            await response.json();

        throw new Error(

            error.detail ??

            "Erro ao excluir usuário."

        );

    }

}

/* ==========================================================
 * Pesquisar Usuários
 * ========================================================== */

export async function searchUsers(
    search: string
): Promise<User[]> {

    const users =
        await getUsers();

    if (!search.trim()) {

        return users;

    }

    const query =
        search.toLowerCase();

    return users.filter((user) =>

        user.name
            .toLowerCase()
            .includes(query)

        ||

        user.email
            .toLowerCase()
            .includes(query)

        ||

        user.role
            .toLowerCase()
            .includes(query)

    );

}

/* ==========================================================
 * Ordenação
 * ========================================================== */

export function sortUsers(
    users: User[],
    field: keyof User = "name"
): User[] {

    return [...users].sort((a, b) => {

        const valueA = String(
            a[field] ?? ""
        ).toLowerCase();

        const valueB = String(
            b[field] ?? ""
        ).toLowerCase();

        return valueA.localeCompare(
            valueB
        );

    });

}