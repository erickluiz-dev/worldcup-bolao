import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Trophy } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
    Mail,
    Lock,
    LogIn,
    UserPlus,
} from "lucide-react";

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

    const RAINBOW_STRIPES = [
    '#E8192C', '#F5821F', '#FDC300', '#00A550',
    '#00AEEF', '#003DA5', '#753BBD', '#E5007E',
    ];

    return (

        <div className="min-h-screen bg-background flex">            

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
                        max-w-[550px]
                        items-center
                        mx-auto
                    "
                >
                    <div className="absolute top-0 left-0 w-full flex h-2">
                        {RAINBOW_STRIPES.map((color) => (
                        <div key={color} className="flex-1" style={{ backgroundColor: color }} />
                        ))}
                    </div>

                    <div className="flex h-1.5 w-full">
                        
                    </div>
                    
                    <div className="w-28 h-28 mx-auto mb-5 container-central">
                        <img
                            src="/taca.png"
                            alt="Copa do Mundo"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />

                    </div>

                    <h2
                        className="
                            text-6xl    
                            font-black
                            uppercase
                            mb-1
                            text-center
                        "
                        style={{
                            fontFamily:
                                "'Barlow Condensed', sans-serif",
                        }}
                    >
                        BOLÃO
                    </h2>

                    <p className="text-base font-bold uppercase tracking-widest text-center mb-5"
                        style={{ color: '#C41E3A', fontFamily: "'Barlow Condensed', sans-serif" }}>
                            COPA DO MUNDO 2026
                    </p>
                    
                    <div
                        className="
                            rounded-3xl 
                            border
                            border-white/10
                            bg-[#151A32]
                            shadow-2xl
                            overflow-hidden
                            p-5
                        "
                    >

                       <div className="grid grid-cols-2 -mx-5 -mt-5 mb-7 h-14">

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    h-full
                                    font-bold
                                    text-white
                                    border-b-2
                                    border-primary
                                "
                            >
                                <LogIn size={16} />
                                Entrar
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    h-full
                                    font-bold
                                    text-muted-foreground
                                    border-b
                                    border-white/10
                                    hover:text-white
                                    transition-colors
                                "
                            >
                                <UserPlus size={16} />
                                Criar Conta
                            </button>

                        </div>

                        <div className="text-center mb-7">
                            <p className="text-sm text-muted-foreground">
                            Faça seus palpites, acompanhe a classificação, dispute com seus amigos e descubra quem mais entende de futebol.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7"
                        >

                            <div>

                               <label
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-muted-foreground
                                        mb-2
                                    "
                                >
                                    <Mail size={15} />
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
                                    placeholder="Seu e-mail"
                                    className="
                                        w-full
                                        rounded-2xl
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
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-muted-foreground
                                        mb-2
                                    "
                                >
                                    <Lock size={15} />
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
                                        placeholder="Sua senha"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-border:
                                            bg-card
                                            px-4
                                            py-4
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
                                            rounded-2xl
                                            border
                                            border-red-500/30
                                            bg-red-500/10
                                            px-4
                                            py-4
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
                                    className="w-full py-3.5 rounded-xl font-bold text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
                                    style={{
                                    background: 'linear-gradient(135deg, #C41E3A, #8B1020)',
                                    color: '#fff',
                                    boxShadow: '0 8px 32px rgba(196,30,58,0.4)',
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    }}
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

            <div className="fixed absolute bottom-0 left-0 w-full flex h-2 z-50">
                {RAINBOW_STRIPES.map((color) => (
                <div key={color} className="flex-1" style={{ backgroundColor: color }} />
                ))}
            </div>
            
        </div>
    );
}
