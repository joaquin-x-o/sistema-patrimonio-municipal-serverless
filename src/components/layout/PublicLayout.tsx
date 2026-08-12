import { Outlet } from "react-router-dom";

// layout para rutas públicas (login)
export default function PublicLayout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}