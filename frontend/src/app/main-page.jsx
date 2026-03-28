import { useState } from "react";

import Dashboard from "../views/dashboard.jsx";
import { Navigation } from "../components/navigation.jsx";
import { ContextProvider } from "../lib/context.jsx";
import { SalesView } from "../views/sales-view.jsx";
import { InventoryView } from "../views/inventory-view.jsx";
import { HistoryView } from "../views/history-view.jsx";
import { LoginView } from "../views/login-view.jsx";
import { getStoredAuth, storeAuth } from "../lib/auth.js";

function Content() {
    const [currentView, setCurrentView] = useState("dashboard");

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
            default:
                return <Dashboard />
        }
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Navigation currentView={currentView} onNavigate={setCurrentView}/>

            <main className="flex-1 overflow-auto pb-24 lg:pb-0">
                <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                    {renderView()}
                </div>
            </main>
        </div>
    )
}

function MainPage() {
    const [auth, setAuth] = useState(() => getStoredAuth());

    if (!auth) {
        return (
            <LoginView
                onLogin={(authData) => {
                    storeAuth(authData);
                    setAuth(authData);
                }}
            />
        );
    }

    return (
        <ContextProvider authToken={auth?.token}>
            <Content/>
        </ContextProvider>
    )
}

export default MainPage
