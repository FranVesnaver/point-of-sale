import { useState } from "react";
import { ShieldCheck, Store } from "lucide-react";
import { login } from "../api/authApi.js";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../components/ui/card.jsx";

export function LoginView({ onLogin }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const authData = await login(formData.username.trim(), formData.password);
            onLogin?.(authData);
        } catch (err) {
            setError(err?.message ?? "No se pudo iniciar sesion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.18),transparent_45%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(250,204,21,0.16),transparent_50%)]" />
                <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-xl">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Store className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                SuperLaEntrada
                            </p>
                            <h1 className="text-2xl font-bold text-foreground">Acceso al punto de venta</h1>
                        </div>
                    </div>

                    <Card className="border-border/60 bg-card/95 backdrop-blur">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-xl">Inicia sesion</CardTitle>
                            <CardDescription>
                                Usa tus credenciales para continuar con la gestion del local.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground" htmlFor="username">
                                        Usuario
                                    </label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="ej. cajero01"
                                        autoComplete="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground" htmlFor="password">
                                        Contrasena
                                    </label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                                {error ? (
                                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                        {error}
                                    </div>
                                ) : null}
                                <Button className="w-full" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Ingresando..." : "Ingresar"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Acceso seguro con token
                            </span>
                            <span>Soporte interno</span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
