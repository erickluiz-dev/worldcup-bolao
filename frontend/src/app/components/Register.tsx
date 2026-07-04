import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState(1);
    const [avatarPage, setAvatarPage] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
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

    return (
        <div className="min-h-screen lg:h-screen grid lg:grid-cols-2">

            {/* Banner */}

            <div
                className="
                    hidden
                    lg:flex
                    flex-col
                    justify-center
                    items-center
                    bg-gradient-to-br
                    from-primary
                    to-red-900
                    text-white
                    p-12
                "
            >
                <h1 className="text-6xl font-black uppercase mb-6">
                    Bolão
                </h1>

                <h2 className="text-3xl font-bold mb-6">
                    Copa do Mundo
                </h2>

                <p className="max-w-md text-center text-lg opacity-90">
                    Crie sua conta para começar a participar do
                    bolão, registrar seus palpites e disputar o
                    ranking da competição.
                </p>
            </div>

            {/* Formulário */}

            <div
                className="
                    flex
                    justify-center
                    overflow-y-auto
                    p-8
                "
            >

                <div className="w-full max-w-md">

                    <h2 className="text-4xl font-black mb-2">
                        Criar Conta
                    </h2>

                    <p className="text-muted-foreground mb-8">
                        Preencha os dados abaixo para começar.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Nome */}

                        <div>

                            <label className="block mb-2 font-medium">
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
                                        rounded-xl
                                        border
                                        bg-background
                                        py-3
                                        pl-10
                                        pr-4
                                    "
                                />

                            </div>

                        </div>

                        {/* Email */}

                        <div>

                            <label className="block mb-2 font-medium">
                                E-mail
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
                                        rounded-xl
                                        border
                                        bg-background
                                        py-3
                                        pl-10
                                        pr-4
                                    "
                                />

                            </div>

                        </div>

                        {/* Senha */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Senha <p style={{ color: '#515151', lineHeight: '1.6' }}>(Não use sua senha real)</p>
                            </label>

                            <div className="relative">

                                <Lock
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/20
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
                                        rounded-xl
                                        border
                                        bg-background
                                        py-3
                                        pl-10
                                        pr-12
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

                        {/* Confirmar senha */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Confirmar senha<p style={{ color: '#515151', lineHeight: '1.6' }}>(Não use sua senha real)</p>
                            </label>

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
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="********"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        bg-background
                                        py-3
                                        pl-10
                                        pr-12
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                    "
                                >
                                    {showConfirmPassword ? (
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
                                                    aspect-square
                                                    rounded-2xl
                                                    border-2
                                                    transition-all
                                                    duration-200
                                                    overflow-hidden
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
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                bg-primary
                                text-white
                                py-3
                                font-semibold
                                transition
                                hover:opacity-90
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
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
    );
}
