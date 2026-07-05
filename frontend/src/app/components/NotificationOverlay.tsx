import { useEffect } from "react";

import { useNotification } from "../context/NotificationContext";

import "./NotificationOverlay.css";

export default function NotificationOverlay() {

    const {

        currentNotification,

        nextNotification,

    } = useNotification();

    useEffect(() => {

        if (!currentNotification)
            return;

        const timer = setTimeout(() => {

            nextNotification();

        }, 3000);

        return () => clearTimeout(timer);

    }, [currentNotification]);

    if (!currentNotification)
        return null;

    return (

        <div className="notification-overlay">

            <div
                className={`notification-card ${currentNotification.type}`}
            >

                <h1>

                    {currentNotification.title}

                </h1>

                <p>

                    {currentNotification.message}

                </p>

            </div>

        </div>

    );

}