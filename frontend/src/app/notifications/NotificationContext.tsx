import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import { Notification } from "../types/Notification";

import {
    getUnreadNotifications,
    markAsRead,
} from "../services/notificationService";

import { useAuth } from "./AuthContext";

interface NotificationContextType {

    notifications: Notification[];

    currentNotification: Notification | null;

    loadNotifications: () => Promise<void>;

    nextNotification: () => Promise<void>;
}

const NotificationContext =
    createContext<NotificationContextType>(
        {} as NotificationContextType
    );

export function NotificationProvider({
    children,
}: {
    children: ReactNode;
}) {

    const { user } = useAuth();

    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    const [currentNotification, setCurrentNotification] =
        useState<Notification | null>(null);

    // ======================================================
    // Carrega notificações
    // ======================================================

    async function loadNotifications() {

        if (!user) return;

        try {

            const data =
                await getUnreadNotifications(user.id);

            setNotifications(data);

            if (data.length > 0) {

                setCurrentNotification(data[0]);

            } else {

                setCurrentNotification(null);

            }

        } catch (error) {

            console.error(error);

        }
    }

    // ======================================================
    // Próxima notificação
    // ======================================================

    async function nextNotification() {

        if (!currentNotification)
            return;

        try {

            await markAsRead(
                currentNotification.id
            );

        } catch (error) {

            console.error(error);

        }

        const remaining =
            notifications.filter(

                notification =>

                    notification.id !==
                    currentNotification.id

            );

        setNotifications(remaining);

        if (remaining.length > 0) {

            setCurrentNotification(
                remaining[0]
            );

        } else {

            setCurrentNotification(null);

        }
    }

    // ======================================================
    // Login
    // ======================================================

    useEffect(() => {

        loadNotifications();

    }, [user]);

    return (

        <NotificationContext.Provider

            value={{

                notifications,

                currentNotification,

                loadNotifications,

                nextNotification,

            }}

        >

            {children}

        </NotificationContext.Provider>

    );

}

export function useNotification() {

    return useContext(
        NotificationContext
    );

}