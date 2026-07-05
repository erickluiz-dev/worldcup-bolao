import "./NotificationOverlay.css";
import { useEffect, useState } from "react";

import { useNotification } from "./NotificationContext";

export default function NotificationOverlay() {

    const {

        currentNotification,

        nextNotification,

    } = useNotification();

    const [show, setShow] = useState(false);

    useEffect(() => {

        if (!currentNotification) return;

        setShow(true);

        const timer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {

                nextNotification();

            }, 400);

        }, 5000);

        return () => clearTimeout(timer);

    }, [currentNotification]);

    if (!currentNotification)
        return null;

    return (

        <div
            className={`notification-backdrop ${show ? "show" : "hide"}`}
        >

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
