import { cn } from "../lib/utils.js";

const BUTTON_STYLES = {
    default: {
        activeClassname: "bg-primary text-primary-foreground",
        inactiveClassname: "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary",
        buttonClassname: "",
    }
}

export function FilterChips({
    items,
    selectedId,
    onSelect,
    className,
    buttonStylesVariant = "default",
}) {
    const buttonStyles = BUTTON_STYLES[buttonStylesVariant] ?? "default";

    return (
        <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
            {items.map((item) => {
                const isActive = selectedId === item.id;
                const Icon = item.icon;
                return (
                    <button
                        type="button"
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
                            buttonStyles.buttonClassname,
                            isActive ? buttonStyles.activeClassname : buttonStyles.inactiveClassname
                        )}
                    >
                        {Icon && <Icon className="w-4 h-4" />}
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
