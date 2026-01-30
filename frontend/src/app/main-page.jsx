import {useState} from "react";

import Dashboard from "../components/dashboard.jsx";
import {Navigation} from "../components/navigation.jsx";
import {ContextProvider} from "../lib/context.jsx";
import {SalesView} from "../components/sales-view.jsx";
import {InventoryView} from "../components/inventory-view.jsx";
import {HistoryView} from "../components/history-view.jsx";

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
    return (
        <ContextProvider>
            <Content/>
        </ContextProvider>
    )
}

export default MainPage
