import { Card, CardContent } from "./ui/card.jsx"
import { cn } from "../lib/utils.js"

const SIZE_STYLES = {
    sm: {
        container: "p-3 gap-2",
        icon: "w-4 h-4",
        label: "text-xs",
        value: "text-lg"
    },
    md: {
        container: "p-4 md:p-6 gap-3",
        icon: "w-5 h-5 md:w-6 md:h-6",
        label: "text-xs md:text-sm",
        value: "text-xl md:text-2xl"
    }
}

const VARIANT_STYLES = {
    default: {
        card: "",
        iconWrapper: "bg-muted",
        icon: "text-muted-foreground"
    },
    primary: {
        card: "bg-primary text-primary-foreground border-0 shadow-lg shadow-primary/20",
        iconWrapper: "bg-primary-foreground/20",
        icon: ""
    },
    warning: {
        card: "border-destructive/50",
        iconWrapper: "bg-destructive/10",
        icon: "text-destructive"
    }
}

export function StatsCard({
    label,
    value,
    icon: Icon,
    size = "md",
    variant = "default",
    className
}) {
    const sizeStyles = SIZE_STYLES[size] ?? SIZE_STYLES.md
    const variantStyles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default

    return (
        <Card className={cn(variantStyles.card, className)}>
            <CardContent className={cn("flex items-center", sizeStyles.container)}>

                {Icon && (
                    <div className={cn(
                        "rounded-xl flex items-center justify-center w-10 h-10 md:w-12 md:h-12",
                        variantStyles.iconWrapper
                    )}>
                        <Icon className={cn(sizeStyles.icon, variantStyles.icon)} />
                    </div>
                )}

                <div>
                    <p className={cn("opacity-80", sizeStyles.label)}>{label}</p>
                    <p className={cn("font-bold", sizeStyles.value)}>{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}