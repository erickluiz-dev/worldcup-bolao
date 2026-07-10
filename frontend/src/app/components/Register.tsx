import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    LogIn,
    UserPlus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(1);
    const [avatarPage, setAvatarPage] = useState(0);

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        setError("");

        if (!name.trim()) {
            setError("Informe seu nome.");
            return;
        }

        if (!email.trim()) {
            setError("Informe seu e-mail.");
            return;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Informe um e-mail válido.");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve possuir pelo menos 6 caracteres.");
            return;
        }

        try {
            setLoading(true);

            await register({
                name,
                email,
                password,
                avatar, 
            });

            navigate("/");
        } catch (err: any) {
            setError(
                err?.message ??
                    "Não foi possível realizar o cadastro."
            );
        } finally {
            setLoading(false);
        }
    }

    const avatarsPerPage = 12;

    const totalAvatars = 21;

    const visibleAvatars = Array.from(
        { length: totalAvatars },
        (_, index) => index + 1
    ).slice(
        avatarPage * avatarsPerPage,
        avatarPage * avatarsPerPage + avatarsPerPage
    );

    const totalPages = Math.ceil(
        totalAvatars / avatarsPerPage
    );

    const RAINBOW_STRIPES = [
    '#E8192C', '#F5821F', '#FDC300', '#00A550',
    '#00AEEF', '#003DA5', '#753BBD', '#E5007E',
    ];

    return (
        <div className="min-h-screen bg-[#090B1D] relative overflow-y-auto">

            {/* Formulário */}

            <div
                className="
                    flex
                    items-center
                    justify-center
                    p-8
                    pb-8
                    px-8
                "
            >
                <div className="absolute top-0 left-0 w-full flex h-2">
                    {RAINBOW_STRIPES.map((color) => (
                    <div key={color} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                </div>

                <div className="w-full max-w-[550px] mx-auto">
                    
                    <div className="w-28 h-28 mx-auto mb-5">
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

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7"
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
                                        text-muted-foreground
                                        border-b
                                        border-white/10
                                        hover:text-white
                                        transition-colors
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
                                        text-white
                                        border-b-2
                                        border-primary
                                    "
                                >
                                    <UserPlus size={16} />
                                    Criar Conta
                                </button>

                            </div>

                            {/*Informações*/}
                            
                            <div className="text-center mb-7">
                                <p className="text-sm text-muted-foreground">
                                Crie sua conta para começar a fazer seus palpites.
                                </p>
                            </div>

                            {/* Nome */}

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
                                    <User size={15}/>
                                    Nome
                                </label>

                                <div className="relative">

                                    <User
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-muted-foreground
                                        "
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Seu nome"
                                        className="
                                            w-full
                                            py-3
                                            pl-10
                                            pr-4
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-card
                                            outline-none
                                            focus:ring-2
                                            focus:ring-primary
                                        "
                                    />

                                </div>

                            </div>

                            {/* Email */}

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
                                    <Mail size={15}/>
                                    E-MAIL
                                </label>

                                <div className="relative">

                                    <Mail
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-muted-foreground
                                        "
                                        size={18}
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="email@exemplo.com"
                                        className="
                                            w-full
                                            py-3
                                            pl-10
                                            pr-4
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-card
                                            outline-none
                                            focus:ring-2
                                            focus:ring-primary
                                        "
                                    />

                                </div>

                            </div>

                            {/* Senha */}

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
                                        mb-3
                                    "
                                >
                                    <Lock size={15}/>
                                    Senha
                                </label>

                                <p
                                    className="
                                        text-xs
                                        text-muted-foreground
                                        mb-2
                                    "
                                >
                                    (Não use sua senha real)
                                </p>

                                <div className="relative">

                                    <Lock
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-muted-foreground
                                        "
                                        size={18}
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="********"
                                        className="
                                            w-full
                                            py-3
                                            pl-10
                                            pr-4
                                            rounded-2xl
                                            border
                                            border-border
                                            bg-card
                                            outline-none
                                            focus:ring-2
                                            focus:ring-primary
                                        "
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
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Escolha do Avatar */}

                            <div>

                                <label className="block mb-3 font-medium uppercase tracking-wide text-sm">

                                    Escolha seu Avatar

                                </label>

                                    <div
                                        className="
                                            grid
                                            grid-cols-6
                                            gap-3
                                        "
                                    >

                                        {visibleAvatars.map((avatarId) => {

                                            const selected =
                                                avatar === avatarId;

                                            return (

                                                <button
                                                    key={avatarId}
                                                    type="button"
                                                    onClick={() => setAvatar(avatarId)}
                                                    className={`
                                                        w-15
                                                        h-15
                                                        mx-auto
                                                        rounded-2xl
                                                        border-2
                                                        overflow-hidden
                                                        transition-all
                                                        duration-200
                                                        flex
                                                        items-center
                                                        justify-center

                                                        ${
                                                            selected
                                                                ? "border-primary scale-105 shadow-lg"
                                                                : "border-transparent hover:border-primary/40 hover:scale-105"
                                                        }
                                                    `}
                                                >
                                                    <img
                                                        src={`/avatars/avatar${avatarId}.png`}
                                                        alt={`Avatar ${avatarId}`}
                                                        className="
                                                            w-full
                                                            h-full
                                                            object-cover
                                                        "
                                                    />

                                                </button>

                                            );

                                        })}

                                    </div>

                                    {/* Navegação das páginas */}

                                    <div
                                        className="
                                            flex
                                            justify-center
                                            items-center
                                            gap-4
                                            mt-4
                                        "
                                    >

                                        <button
                                            type="button"
                                            disabled={avatarPage === 0}
                                            onClick={() =>
                                                setAvatarPage(page => page - 1)
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-slate-800
                                                hover:bg-slate-700
                                                disabled:opacity-40
                                            "
                                        >

                                            ◀

                                        </button>

                                        <span
                                            className="
                                                text-sm
                                                text-slate-400
                                            "
                                        >

                                            Página {avatarPage + 1} de {totalPages}

                                        </span>

                                        <button
                                            type="button"
                                            disabled={
                                                avatarPage === totalPages - 1
                                            }
                                            onClick={() =>
                                                setAvatarPage(page => page + 1)
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-slate-800
                                                hover:bg-slate-700
                                                disabled:opacity-40
                                            "
                                        >

                                            ▶

                                        </button>

                                    </div>

                            </div>
                            {/* Mensagem de erro */}

                            {error && (
                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-red-500/30
                                        bg-red-500/10
                                        text-red-500
                                        px-4
                                        py-3
                                        text-sm
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            {/* Botão */}

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
                                        ? "Criando conta..."
                                        : "Criar Conta"}
                            </button>
                                
                            {/* Link para Login */}

                            <div className="text-center pt-2">

                                <span className="text-muted-foreground">
                                    Já possui uma conta?
                                </span>

                                <Link
                                    to="/login"
                                    className="
                                        ml-2
                                        font-semibold
                                        text-primary
                                        hover:underline
                                    "
                                >
                                    Entrar
                                </Link>

                            </div>

                        </form>
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
