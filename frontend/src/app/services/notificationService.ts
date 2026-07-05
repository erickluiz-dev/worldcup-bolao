import { Notification } from "../types/Notification";

const API_URL = `${import.meta.env.VITE_API_URL}/notifications`;

export async function getNotifications(
    userId: number
): Promise<Notification[]> {

    const response = await fetch(
        `${API_URL}/user/${userId}`
    );

    if (!response.ok) {
        throw new Error(
            "Erro ao carregar notificações."
        );
    }

    return response.json();
}

export async function getUnreadNotifications(
    userId: number
): Promise<Notification[]> {

    const response = await fetch(
        `${API_URL}/user/${userId}/unread`
    );

    if (!response.ok) {
        throw new Error(
            "Erro ao carregar notificações."
        );
    }

    return response.json();
}

export async function markAsRead(
    notificationId: number
): Promise<void> {

    const response = await fetch(
        `${API_URL}/${notificationId}/read`,
        {
            method: "PATCH",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Erro ao marcar notificação."
        );
    }
}