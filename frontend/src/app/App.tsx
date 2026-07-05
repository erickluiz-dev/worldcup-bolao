import { RouterProvider } from "react-router-dom";

import { router } from "./routes";

import { AuthProvider } from "./context/AuthContext";

import { NotificationProvider } from "./notifications/NotificationContext";

import NotificationOverlay from "./notifications/NotificationOverlay";

export default function App() {

    return (

        <AuthProvider>

            <NotificationProvider>

                <RouterProvider router={router} />

                <NotificationOverlay />

            </NotificationProvider>

        </AuthProvider>

    );

}