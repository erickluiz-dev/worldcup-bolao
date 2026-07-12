  import { usePredictions } from '../context/PredictionsContext';
  import { Trophy, TrendingUp, Star, Zap, Crown, Share2, Download, X  } from 'lucide-react';

  import { useEffect, useState, useRef} from "react";

  import { RankingUser } from "../types/Ranking";
  import { getRanking } from "../services/rankingService";
  import { useAuth } from "../context/AuthContext";

  import html2canvas from "html2canvas";
  import { motion, AnimatePresence } from "motion/react";

  const PODIUM_STYLES = [
    { bg: '#FDC30020', border: '#FDC30050', text: '#FDC300', icon: <Crown className="size-5" style={{ color: '#FDC300' }} /> },
    { bg: '#CCCCCC15', border: '#CCCCCC40', text: '#CCCCCC', icon: <Trophy className="size-5" style={{ color: '#CCC' }} /> },
    { bg: '#CD7F3220', border: '#CD7F3250', text: '#CD7F32', icon: <Star className="size-5" style={{ color: '#CD7F32' }} /> },
  ];

  const AVATAR_COLORS = [
    '#E8192C', '#F5821F', '#FDC300', '#00A550',
    '#00AEEF', '#003DA5', '#753BBD', '#E5007E',
    '#C41E3A', '#8B1E3A',
  ];

  export function Ranking() {
    const { predictions } = usePredictions();
    const [rankingData, setRankingData] = useState<RankingUser[]>([]);

    const cardRef = useRef<HTMLDivElement>(null);

    const [showShareModal, setShowShareModal] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [generating, setGenerating] = useState(false);

    const handleShare = async () => {
        if (!cardRef.current) return;

        setGenerating(true);

        try {
            const canvas = await html2canvas(cardRef.current!, {
                backgroundColor: "#090C1C",
                useCORS: true,
                logging: false,

                onclone: (doc) => {

                    doc.documentElement.style.setProperty("--foreground", "#FFFFFF");
                    doc.documentElement.style.setProperty("--background", "#090C1C");
                    doc.documentElement.style.setProperty("--muted-foreground", "#9CA3AF");
                    doc.documentElement.style.setProperty("--card", "#111827");

                }
            });

            const image = canvas.toDataURL("image/png");

            setPreviewUrl(image);

            requestAnimationFrame(() => {
                setShowShareModal(true);
            });

        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = () => {

        if (!previewUrl) return;

        const a = document.createElement("a");

        a.href = previewUrl;

        a.download = "ranking-copa2026.png";

        a.click();

    };

    const handleNativeShare = async () => {

    if (!previewUrl) return;

        try {

            const blob = await (await fetch(previewUrl)).blob();

            const file = new File(
                [blob],
                "ranking-copa2026.png",
                {
                    type: "image/png",
                }
            );

            await navigator.share({
                files: [file],
                title: "Ranking Copa 2026",
                text: `Estou em ${userRank}º lugar!`
            });

        } catch {

            handleDownload();

        }

    };

    useEffect(() => {

      async function loadRanking() {

          try {

              const ranking = await getRanking();

              setRankingData(ranking);

          } catch {

              setRankingData([
                  {
                      id:1,
                      name:"Você",
                      points:0,
                      predictions:0
                  }
              ]);

          }

      }

      loadRanking();

  }, []);

    const completeRanking = rankingData;
    const { user } = useAuth();
    const currentUserId = user?.id;

    const currentUser = completeRanking.find(
        (u) => u.user_id === currentUserId
    );

    const userPoints = currentUser?.points ?? 0;

    const userPredictionCount = currentUser?.predictions ?? 0;

    const userRank =
      completeRanking.findIndex(
          (user) => user.user_id === currentUserId
      ) + 1;

    const lastRank = completeRanking.length;

    return (
      <div>
        <div className="mb-8 flex items-start justify-between gap-4">

            <div>

                <h2
                    className="text-5xl font-black uppercase tracking-tight mb-1"
                    style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        color: "#FFFFFF",
                    }}
                >
                    Ranking
                </h2>

                <p className="text-gray-400">
                    Veja como você está se saindo em relação aos outros participantes
                </p>

            </div>

            <button
                onClick={handleShare}
                disabled={generating}
                className="
                    h-12
                    px-7
                    rounded-2xl
                    flex
                    items-center
                    gap-3
                    font-bold
                    transition-all
                    hover:scale-105
                    active:scale-95
                "
                style={{
                    background:
                        "linear-gradient(90deg,#E8192C,#C41E3A)",
                    color:"#FFF",
                    boxShadow:
                        "0 8px 28px rgba(232,25,44,.35)",
                }}
            >
                <Share2 className="size-5" />

                {generating ? "Gerando..." : "Compartilhar"}

            </button>

        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
                icon={<Trophy className="size-7 text-[#FDC300]" />}
                label="Seus Pontos"
                value={userPoints}
                bg="#FDC30015"
                border="#FDC30030"
            />

            <StatCard
                icon={<Zap className="size-7 text-[#00AEEF]" />}
                label="Palpites Feitos"
                value={userPredictionCount}
                bg="#00AEEF15"
                border="#00AEEF30"
            />

            <StatCard
                icon={<TrendingUp className="size-7 text-[#C41E3A]" />}
                label="Sua Posição"
                value={`${userRank}º`}
                bg="rgba(196,30,58,0.1)"
                border="rgba(196,30,58,0.2)"
            />
        </div>

        {/* Ranking list */}
        
        <div className="space-y-2">
          {completeRanking.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.user_id === currentUserId;
            const isPodium = rank <= 3;
            const isLastPlace = rank === lastRank;
            const style = isPodium ? PODIUM_STYLES[rank - 1] : null;
            

            return (
              <div
                key={user.user_id}
                className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all"
                style={{
                  background: isCurrentUser
                    ? 'rgba(196,30,58,0.08)'
                    : isPodium
                    ? style!.bg
                    : isLastPlace
                    ? 'rgba(196,30,58,0.08)'
                    : '#111827',
                  border: isCurrentUser
                    ? '1px solid rgba(196,30,58,0.3)'
                    : isPodium
                    ? `1px solid ${style!.border}`
                    : isLastPlace
                    ? '1px solid rgba(196,30,58,0.30)'
                    : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Rank */}
                <div className="w-10 flex items-center justify-center shrink-0">
                  {isPodium ? (
                    <div>{style!.icon}</div>
                  ) : (
                    <span
                      className="text-base font-bold"
                      style={{
                          color: isLastPlace
                              ? "#C41E3A"
                              : "#9CA3AF",
                      }}
                  >
                      {rank}º
                  </span>
                  )}
                </div>

                {/* Avatar */}
                <img

                  src={`/avatars/avatar${user.avatar}.png`}

                  alt={user.name}

                  className="
                      w-10
                      h-10
                      rounded-full
                      object-cover
                      shrink-0
                      border
                      border-white/20
                  "

              />

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <span
                    className="font-semibold text-sm truncate block"
                    style={{ color: isCurrentUser
                                ? '#C41E3A'
                                : isPodium
                                ? style!.text
                                : isLastPlace
                                ? '#C41E3A'
                                : '#FFFFFF', }}
                  >
                    {user.name}
                    {isCurrentUser && (
                      <span
                        className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(196,30,58,0.2)', color: '#C41E3A' }}
                      >
                        Você
                      </span>
                    )}
                  </span>
                    <span
                        className="text-xs"
                        style={{ color: "#9CA3AF" }}
                    >
                        {user.predictions} palpites
                    </span>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <div
                    className="text-xl font-black"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: isCurrentUser
                        ? '#C41E3A'
                        : isPodium
                        ? style!.text
                        : isLastPlace
                        ? '#C41E3A'
                        : '#FFFFFF',
                    }}
                  >
                    {user.points}
                  </div>
                  <div
                      className="text-xs"
                      style={{ color: "#9CA3AF" }}
                  >
                      pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
              className="mt-8 rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(0,174,239,0.08)', border: '1px solid rgba(0,174,239,0.2)' }}
            >
              <TrendingUp className="size-5 text-[#00AEEF] mt-0.5 shrink-0" />
              <p
                  className="text-sm"
                  style={{ color: "#9CA3AF" }}
              >
                <span
                    className="font-semibold" 
                    style={{ color: "#FFFFFF" }}
                >Como funciona a pontuação:</span>{' '}
                Os pontos são calculados com base na precisão dos seus palpites. Continue fazendo palpites para aumentar sua pontuação!
              </p>
        </div>

        {/* ==========================================================
            CARD OCULTO PARA COMPARTILHAMENTO
        ========================================================== */}

        <div
            style={{
                position: "fixed",
                left: "-10000px",
                top: "-10000px",
                pointerEvents: "none",
                zIndex: -1,
            }}
        >
            <div
                ref={cardRef}
                className="w-[720px] rounded-[32px]"
                style={{
                    background: "#090C1C",
                    color: "white",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    minHeight: "1200px",
                }}
            >

                {/* Barra colorida */}

                <div className="flex h-3 w-full">

                    <div className="flex-1 bg-[#E8192C]" />
                    <div className="flex-1 bg-[#F5821F]" />
                    <div className="flex-1 bg-[#FDC300]" />
                    <div className="flex-1 bg-[#00A550]" />
                    <div className="flex-1 bg-[#00AEEF]" />
                    <div className="flex-1 bg-[#003DA5]" />
                    <div className="flex-1 bg-[#753BBD]" />
                    <div className="flex-1 bg-[#E5007E]" />

                </div>

                <div className="px-10 py-8">

                    {/* Cabeçalho */}

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <img
                                src="/taca.png"
                                className="w-22"
                                alt="Taça"
                            />

                            <div>

                                <h1 className="text-5xl font-black leading-none mb-4">
                                    PALPITES
                                </h1>

                                <p className="text-[#E8192C] font-bold tracking-widest">
                                    COPA DO MUNDO 2026
                                </p>

                            </div>

                        </div>

                        

                    </div>

                    <div
                        className="mt-8 mb-8"
                        style={{
                            borderTop: "1px solid rgba(255,255,255,.08)"
                        }}
                    />

                    {/* Ranking */}

                    <h2 className="text-6xl font-black mb-8">

                        RANKING

                    </h2>

                    <div className="space-y-5">

                        {completeRanking
                            .slice(0, 10)
                            .map((player, index) => (

                            <div
                                key={player.user_id}
                                className="flex items-center justify-between"
                            >

                                <div className="flex items-center gap-4">

                                    <span
                                        className="w-10 text-2xl font-bold"
                                        style={{
                                            color:
                                                index === 0
                                                    ? "#FDC300"
                                                    : index === 1
                                                    ? "#CCCCCC"
                                                    : index === 2
                                                    ? "#CD7F32"
                                                    : "#FFFFFF",
                                        }}
                                    >
                                        {index + 1}º
                                    </span>

                                    <img
                                        src={`/avatars/avatar${player.avatar}.png`}
                                        className="w-12 h-12 rounded-full"
                                        alt={player.name}
                                    />

                                    <div>

                                        <div className="text-2xl font-bold">
                                            {player.name}
                                        </div>

                                        <div className="text-lg" style={{ color: "#9CA3AF" }}>
                                            {player.predictions} palpites
                                        </div>

  </div>

                                </div>

                                <div className="text-right">

                                    <div className="text-3xl font-black text-[#FDC300]">

                                        {player.points}

                                    </div>

                                    <div style={{ color: "#9CA3AF" }}>

                                        pts

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    <div
                        className="mt-10 pt-6 text-center text-gray-500 text-lg"
                        style={{
                            color: "#6B7280",
                            borderTop: "1px solid rgba(255,255,255,.08)"
                        }}
                    >

                        worldcup-bolao-one.vercel.app

                    </div>

                </div>

            </div>

        </div>
          
        <AnimatePresence>

              {showShareModal && (

                  <motion.div

                      className="fixed inset-0 z-50 flex items-center justify-center"

                      initial={{ opacity: 0 }}

                      animate={{ opacity: 1 }}

                      exit={{ opacity: 0 }}

                  >

                      {/* Fundo */}

                      <div

                          className="absolute inset-0 bg-black/75 backdrop-blur-sm"

                          onClick={() => setShowShareModal(false)}

                      />

                      {/* Janela */}

                      <motion.div

                          initial={{
                              opacity: 0,
                              scale: .92,
                              y: 30,
                          }}

                          animate={{
                              opacity: 1,
                              scale: 1,
                              y: 0,
                          }}

                          exit={{
                              opacity: 0,
                              scale: .92,
                              y: 30,
                          }}

                          transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 24,
                          }}

                          className="relative z-10 w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl"

                          style={{
                              background: "#0B0F23",
                              border: "1px solid rgba(255,255,255,.08)",
                              boxShadow: "0 20px 80px rgba(0,0,0,.65)",
                          }}

                      >

                          {/* Cabeçalho */}

                          <div className="px-8 py-6 flex items-center justify-between">

                              <div>

                                  <h2
                                      className="text-4xl font-black text-white"
                                      style={{
                                          fontFamily:
                                              "'Barlow Condensed', sans-serif",
                                      }}
                                  >
                                      Compartilhar Ranking
                                  </h2>

                                  <p className="text-gray-400 mt-1">

                                      Compartilhe sua posição com seus amigos.

                                  </p>

                              </div>

                              <button

                                  onClick={() => setShowShareModal(false)}

                                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition"

                              >

                                  <X className="mx-auto text-white" />

                              </button>

                          </div>

                          {/* Preview */}

                          <div className="px-8">

                              <p className="text-white">
                                {previewUrl ? "" : "Sem preview"}
                              </p>

                              {previewUrl && (

                                  <img

                                      src={previewUrl}

                                      alt="Preview"

                                      className="rounded-2xl border border-white/10"

                                  />

                              )}

                          </div>

                          {/* Rodapé */}

                          <div className="p-8 flex gap-4">

                              <button

                                  onClick={handleNativeShare}

                                  className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition"

                                  style={{

                                      background:
                                          "linear-gradient(90deg,#E8192C,#C41E3A)",

                                      boxShadow:
                                          "0 10px 30px rgba(232,25,44,.35)",

                                  }}

                              >

                                  <Share2 className="size-5" />

                                  Compartilhar

                              </button>

                              <button

                                  onClick={handleDownload}

                                  className="h-14 px-8 rounded-2xl flex items-center gap-3 font-bold"

                                  style={{
                                      background: "rgba(255,255,255,.06)",
                                      color: "white",
                                      border: "1px solid rgba(255,255,255,.08)",
                                  }}

                              >

                                  <Download className="size-5" />

                                  Baixar

                              </button>

                          </div>

                      </motion.div>

                  </motion.div>

              )}

          </AnimatePresence>

      </div>
    );
  }

  function StatCard({
    icon,
    label,
    value,
    bg,
    border,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    bg: string;
    border: string;
  }) {
    return (
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {icon}
        </div>
        <div>
          <div
              className="text-xs font-medium mb-0.5"
              style={{ color: "#9CA3AF" }}
          >{label}</div>
          <div
              className="text-3xl font-black"
              style={{
                  color: "#FFFFFF",
                  fontFamily: "'Barlow Condensed', sans-serif",
              }}
          >
            {value}
          </div>
        </div>
      </div>
    );
  }
