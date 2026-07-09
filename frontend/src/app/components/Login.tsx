import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Trophy } from "lucide-react";

import { useAuth } from "../context/AuthContext";

/* ==========================================================
 * Login
 * ========================================================== */

export default function Login() {
    const navigate = useNavigate();

    const {
        login,
        authenticated,
    } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    if (authenticated) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Informe seu e-mail.");
            return;
        }

        if (!password.trim()) {
            setError("Informe sua senha.");
            return;
        }

        try {
            setLoading(true);

            await login({
                email,
                password,
            });

            navigate("/");

        } catch (err: any) {
            setError(
                err.message ??
                    "Não foi possível realizar o login."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex">

            {/* ======================================================
             * Banner lateral
             * ====================================================== */}

            <div
                className="
                    hidden
                    lg:flex
                    w-1/2
                    relative
                    overflow-hidden
                    bg-gradient-to-br
                    from-red-700
                    via-red-600
                    to-red-900
                    items-center
                    justify-center
                    p-12
                "
            >

                <div className="absolute inset-0 opacity-10">

                    <div className="absolute top-10 left-10 w-56 h-56 rounded-full border border-white" />

                    <div className="absolute bottom-24 right-12 w-80 h-80 rounded-full border border-white" />

                </div>

                <div className="relative z-10 text-center text-white">

                    <div
                        className="
                            w-28
                            h-28
                            rounded-full
                            bg-white/10
                            flex
                            items-center
                            justify-center
                            mx-auto
                            mb-8
                        "
                    >
                        <Trophy
                            size={56}
                            className="text-yellow-300"
                        />
                    </div>

                    <h1
                        className="
                            text-6xl
                            font-black
                            uppercase
                            mb-6
                        "
                        style={{
                            fontFamily:
                                "'Barlow Condensed', sans-serif",
                        }}
                    >
                        Bolão
                        <br />
                        Copa do Mundo
                    </h1>

                    <p
                        className="
                            text-lg
                            leading-8
                            max-w-md
                            mx-auto
                            text-red-100
                        "
                    >
                        Faça seus palpites,
                        acompanhe a classificação,
                        dispute com seus amigos
                        e descubra quem mais entende
                        de futebol.
                    </p>

                </div>

            </div>

            {/* ======================================================
             * Formulário
             * ====================================================== */}

            <div
                className="
                    flex-1
                    flex
                    items-center
                    justify-center
                    p-8
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                    "
                >

                    <h2
                        className="
                            text-4xl
                            font-black
                            uppercase
                            mb-2
                        "
                        style={{
                            fontFamily:
                                "'Barlow Condensed', sans-serif",
                        }}
                    >
                        ENTRAR
                    </h2>

                    <p className="text-base font-bold uppercase tracking-widest text-center"
                        style={{ color: '#C41E3A', fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Faça login para acessar
                        o seu bolão.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    mb-2
                                "
                            >
                                E-mail
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Digite seu e-mail"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-card
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-primary
                                "
                                autoComplete="email"
                            />

                        </div>

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    mb-2 
                                "
                            >
                                Senha
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Digite sua senha"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-border:
                                        bg-card
                                        px-4
                                        py-3
                                        pr-12
                                        outline-none
                                        focus:ring-2
                                        focus:ring-primary
                                        mb-7
                                    "
                                    autoComplete="current-password"
                                />
                                    
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/3
                                        -translate-y-1/2
                                        text-muted-foreground
                                    "
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>
                            {error && (
                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-red-500/30
                                        bg-red-500/10
                                        px-4
                                        py-3
                                        text-sm
                                        text-red-500
                                        mb-2.5
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-primary
                                    py-3
                                    font-semibold
                                    text-primary-foreground
                                    transition-all
                                    hover:opacity-90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {loading
                                    ? "Entrando..."
                                    : "ENTRAR NA DISPUTA >  "}
                            </button>

                        </div>

                    </form>

                    <div className="mt-8 text-center">

                        <span className="text-muted-foreground">
                            Ainda não possui uma conta?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="
                                ml-2
                                font-semibold
                                text-primary
                                hover:underline
                            "
                        >
                            Cadastre-se
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}
