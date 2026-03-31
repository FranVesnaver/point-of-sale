import { useState } from "react";

import Dashboard from "../views/dashboard.jsx";
import { Navigation } from "../components/navigation.jsx";
import { ContextProvider } from "../lib/context.jsx";
import { SalesView } from "../views/sales-view.jsx";
import { InventoryView } from "../views/inventory-view.jsx";
import { HistoryView } from "../views/history-view.jsx";
import { LoginView } from "../views/login-view.jsx";
import { CreateUserView } from "../views/create-user-view.jsx";
import { logout } from "../api/authApi.js";
import { clearAuth, getStoredAuth, storeAuth } from "../lib/auth.js";

function Content({ auth, onLogout }) {
    const [currentView, setCurrentView] = useState("dashboard");
    const canManageUsers = auth?.admin ?? false;

    const renderView = () => {
        switch (currentView) {
            case "dashboard":
                return <Dashboard />
            case "sales":
                return <SalesView />
            case "inventory":
                return <InventoryView />
            case "history":
                return <HistoryView />
            case "users":
                return <CreateUserView auth={auth} />
            default:
                return <Dashboard />
        }
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Navigation
                currentView={currentView}
                onNavigate={setCurrentView}
                canManageUsers={canManageUsers}
                username={auth?.username}
                onLogout={onLogout}
            />

            <main className="flex-1 overflow-auto pb-24 lg:pb-0">
                <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                    { renderView() }
                </div>
            </main>
        </div>
    )
}

function MainPage() {
    const [auth, setAuth] = useState(() => getStoredAuth());
    const [authView, setAuthView] = useState("login");

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to invalidate auth token on logout", error);
        } finally {
            clearAuth();
            setAuth(null);
            setAuthView("login");
        }
    };

    if (!auth) {
        return (
            authView === "create-user" ? (
                <CreateUserView
                    mode="bootstrap"
                    onBack={() => setAuthView("login")}
                    onUserCreated={() => setAuthView("login")}
                />
            ) : (
                <LoginView
                    onLogin={(authData) => {
                        storeAuth(authData);
                        setAuth(authData);
                    }}
                    onCreateUser={() => setAuthView("create-user")}
                />
            )
        );
    }

    return (
        <ContextProvider authToken={auth?.token}>
            <Content auth={auth} onLogout={handleLogout} />
        </ContextProvider>
    )
}

export default MainPage
