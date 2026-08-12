import AppSidebar from "../../app/AppSidebar";
import Topbar from "./topbar/Topbar";
import { SidebarProvider } from "./sidebar/SidebarProvider";
import { Outlet } from "react-router-dom";

// layout para acceso a rutas privadas

/* NOTA: la visualizacion y limitacion de funcionalidades segun el rol del usuario es aplicado mediante middlewares y
 el uso del contexto de la sesión del usuario (useAuth()) */

export default function PrivateLayout() {
    return (
        <div className="flex h-screen bg-background overflow-hidden text-foreground">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4">
                        <Outlet />
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}