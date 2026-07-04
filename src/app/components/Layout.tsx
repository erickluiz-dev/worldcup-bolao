import { Outlet, Link, useLocation } from "react-router-dom";
import {
    Trophy,
    List,
    BarChart3,
    LogOut,
} from "lucide-react";
import { PredictionsProvider } from '../context/PredictionsContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import fifaLogo from '@/imports/image.png';
import { useAuth } from "../context/AuthContext";

const RAINBOW_STRIPES = [
  '#E8192C', '#F5821F', '#FDC300', '#00A550',
  '#00AEEF', '#003DA5', '#753BBD', '#E5007E',
];

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <PredictionsProvider>
      <div className="min-h-screen bg-background">

        {/* Header */}
        <header className="relative bg-[#080B1A] border-b border-white/10 overflow-hidden">
          {/* Diagonal background accent */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -right-20 -top-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #C41E3A, transparent)' }}
            />
            <div
              className="absolute right-40 -bottom-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #753BBD, transparent)' }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between gap-6">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-4 group"
                >

                    <div className="w-16 h-16 flex-shrink-0 relative">

                        <img
                          src="/taca.png"
                          alt="Copa do Mundo"
                          className="w-full"
                        />

                    </div>

                    <div>

                        <h1
                            className="text-2xl font-black uppercase tracking-wider text-white leading-tight"
                            style={{
                                fontFamily:
                                    "'Barlow Condensed', sans-serif",
                            }}
                        >

                            BOLÃO

                        </h1>

                        <p
                            className="text-sm font-bold uppercase tracking-widest leading-tight"
                            style={{
                                color: "#C41E3A",
                                fontFamily:
                                    "'Barlow Condensed', sans-serif",
                            }}
                        >

                            Copa do Mundo 2026

                        </p>

                    </div>

                </Link>

                {/* Menu */}

                <nav className="hidden md:flex items-center gap-1">

                    <NavLink
                        to="/"
                        active={isActive("/")}
                        icon={<List className="size-4" />}
                        label="Jogos"
                    />

                    <NavLink
                        to="/meus-palpites"
                        active={isActive("/meus-palpites")}
                        icon={<Trophy className="size-4" />}
                        label="Meus Palpites"
                    />

                    <NavLink
                        to="/ranking"
                        active={isActive("/ranking")}
                        icon={<BarChart3 className="size-4" />}
                        label="Ranking"
                    />

                </nav>

                {/* Usuário */}

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            px-3
                            py-2
                            rounded-full
                            border
                            border-white/10
                            bg-white/5
                        "
                    >

                        <img
                            src={`/avatars/avatar${user?.avatar}.png`}
                            alt={user?.name}
                            className="
                                w-12
                                h-12
                                rounded-full
                                object-cover
                            "
                        />

                        <div className="hidden lg:block">

                            <p className="font-semibold text-white">

                                {user?.name}

                            </p>

                            <p className="text-xs text-gray-400">

                                {user?.role === "admin"

                                    ? "Administrador"

                                    : "Usuário"}

                            </p>

                        </div>

                    </div>

                    <button

                        onClick={logout}

                        title="Sair"

                        className="
                            p-2
                            rounded-full
                            text-gray-400
                            hover:text-white
                            hover:bg-white/10
                            transition
                        "

                    >

                        <LogOut className="size-5"/>

                    </button>

                  </div> {/* fecha bloco do usuário */}

                 </div> {/* fecha flex */}

            </div> {/* fecha max-w-7xl */}


          {/* Rainbow stripe bar */}
          <div className="flex h-1.5 w-full">
            {RAINBOW_STRIPES.map((color) => (
              <div key={color} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden bg-card border-b border-white/10 sticky top-0 z-20">
          <div className="flex">
            <MobileNavLink to="/" active={isActive('/')} icon={<List className="size-4" />} label="Jogos" />
            <MobileNavLink to="/meus-palpites" active={isActive('/meus-palpites')} icon={<Trophy className="size-4" />} label="Palpites" />
            <MobileNavLink to="/ranking" active={isActive('/ranking')} icon={<BarChart3 className="size-4" />} label="Ranking" />
          </div>
          <div className="flex h-0.5 w-full">
            {RAINBOW_STRIPES.map((color) => (
              <div key={color} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </main>

        <footer className="bg-card border-t border-white/10 mt-16">
          <div className="flex h-1 w-full">
            {RAINBOW_STRIPES.map((color) => (
              <div key={color} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
          <div className="max-w-7xl mx-auto px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              ⚽ Palpites Copa do Mundo 2026 &mdash; Faça seus palpites e boa sorte! 🏆
            </p>
          </div>
        </footer>
      </div>
    </PredictionsProvider>
  );
}

function NavLink({ to, active, icon, label }: { to: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
        active
          ? 'bg-primary text-white shadow-lg shadow-primary/30'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ to, active, icon, label }: { to: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
