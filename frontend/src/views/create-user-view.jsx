import { useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { createUser } from "../api/usersApi.js";

export function CreateUserView({
    mode = "admin",
    auth,
    onBack,
    onUserCreated
}) {
    const isBootstrap = mode === "bootstrap";
    const isAdmin = auth?.admin ?? false;
    const canCreate = isBootstrap || isAdmin;

    const [formData, setFormData] = useState(() => ({
        username: "",
        password: "",
        admin: isBootstrap
    }));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const title = useMemo(() => (
        isBootstrap ? "Crear administrador inicial" : "Crear usuario"
    ), [isBootstrap]);

    const helperCopy = useMemo(() => {
        if (isBootstrap) {
            return "El primer usuario del sistema debe tener permisos de administrador.";
        }
        return "Solo un administrador puede crear usuarios nuevos.";
    }, [isBootstrap]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!canCreate) return;

        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const adminValue = isBootstrap ? true : formData.admin;
            await createUser(formData.username.trim(), formData.password, adminValue);
            setSuccess(isBootstrap
                ? "Administrador creado. Ya puedes iniciar sesión."
                : "Usuario creado correctamente."
            );
            setFormData({
                username: "",
                password: "",
                admin: isBootstrap
            });
        } catch (err) {
            setError(err?.message ?? "No se pudo crear el usuario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formContent = (
        <Card className="border-border/60 bg-card/95 backdrop-blur">
            <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{helperCopy}</CardDescription>
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
                            placeholder="ej. admin01"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isSubmitting || !canCreate}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground" htmlFor="password">
                            Contraseña
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isSubmitting || !canCreate}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Permisos</label>
                        <label className="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/40 px-3 py-3">
                            <input
                                type="checkbox"
                                name="admin"
                                className="mt-1 h-4 w-4 accent-primary"
                                checked={formData.admin}
                                onChange={handleChange}
                                disabled={isSubmitting || !canCreate || isBootstrap}
                            />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Administrador</p>
                                <p className="text-xs text-muted-foreground">
                                    Puede crear usuarios y modificar inventario.
                                </p>
                            </div>
                        </label>
                        {isBootstrap ? (
                            <p className="text-xs text-muted-foreground">
                                Este permiso es obligatorio para el primer usuario.
                            </p>
                        ) : null}
                    </div>

                    {!canCreate ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            Solo un administrador puede crear usuarios.
                        </div>
                    ) : null}
                    {error ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    ) : null}
                    {success ? (
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
                            {success}
                        </div>
                    ) : null}
                    <Button className="w-full" type="submit" disabled={isSubmitting || !canCreate}>
                        {isSubmitting ? "Creando..." : "Crear usuario"}
                    </Button>
                    {isBootstrap && success && onUserCreated ? (
                        <Button
                            className="w-full"
                            type="button"
                            variant="outline"
                            onClick={onUserCreated}
                        >
                            Ir a iniciar sesión
                        </Button>
                    ) : null}
                </form>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Gestión segura de usuarios
                </span>
                <span>SuperLaEntrada</span>
            </CardFooter>
        </Card>
    );

    if (isBootstrap) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-background">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.18),transparent_45%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(250,204,21,0.16),transparent_50%)]" />
                    <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
                </div>

                <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
                    <div className="w-full max-w-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        SuperLaEntrada
                                    </p>
                                    <h1 className="text-2xl font-bold text-foreground">Alta de usuario</h1>
                                </div>
                            </div>
                            {onBack ? (
                                <Button variant="ghost" size="sm" type="button" onClick={onBack}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </Button>
                            ) : null}
                        </div>
                        {formContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Usuarios</h1>
                <p className="text-muted-foreground">
                    Crea usuarios nuevos para operar el punto de venta.
                </p>
            </div>
            <div className="max-w-2xl">
                {formContent}
            </div>
        </div>
    );
}
