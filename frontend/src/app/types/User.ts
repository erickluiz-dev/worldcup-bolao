export type CreateUserRequest = {
    name: string;
    email: string;
    password: string;
    avatar: number;
    role?: "admin" | "user";
    active?: boolean;
};

export type UpdateUserRequest = User & {
    password?: string;
};
/* ==========================================================
 * Criação
 * ========================================================== */

export interface CreateUserRequest {

    name: string;

    email: string;

    password: string;

    avatar: number;

    role?: "admin" | "user";

    active?: boolean;

}

/* ==========================================================
 * Atualização
 * ========================================================== */

export interface UpdateUserRequest
    extends User {

    password?: string;

}   