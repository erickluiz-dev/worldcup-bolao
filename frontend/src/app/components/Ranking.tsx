import { usePredictions } from '../context/PredictionsContext';
import { Trophy, TrendingUp, Star, Zap, Crown } from 'lucide-react';

import { useEffect, useState } from "react";

import { RankingUser } from "../types/Ranking";
import { getRanking } from "../services/rankingService";
import { useAuth } from "../context/AuthContext";

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

  const userPredictionCount = Object.keys(predictions).length;
  const userPoints = userPredictionCount * 3;

  const completeRanking = rankingData;
  const { user } = useAuth();
  const currentUserId = user?.id;

  const userRank =
    completeRanking.findIndex(
        (user) => user.user_id === currentUserId
    ) + 1;

  return (
    <div>
      <div className="mb-8">
        <h2
          className="text-5xl font-black uppercase tracking-tight text-foreground mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Ranking
        </h2>
        <p className="text-muted-foreground">
          Veja como você está se saindo em relação aos outros participantes
        </p>
      </div>

      {/* Ranking list */}
      
      <div className="space-y-2">
        {completeRanking.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.user_id === currentUserId;
          const isPodium = rank <= 3;
          const style = isPodium ? PODIUM_STYLES[rank - 1] : null;
          

          return (
            <div
              key={user.id}
              className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all"
              style={{
                background: isCurrentUser
                  ? 'rgba(196,30,58,0.08)'
                  : isPodium
                  ? style!.bg
                  : 'var(--card)',
                border: isCurrentUser
                  ? '1px solid rgba(196,30,58,0.3)'
                  : isPodium
                  ? `1px solid ${style!.border}`
                  : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Rank */}
              <div className="w-10 flex items-center justify-center shrink-0">
                {isPodium ? (
                  <div>{style!.icon}</div>
                ) : (
                  <span className="text-base font-bold text-muted-foreground">{rank}º</span>
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
                  style={{ color: isCurrentUser ? '#C41E3A' : isPodium ? style!.text : 'var(--foreground)' }}
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
                <span className="text-xs text-muted-foreground">{user.predictions} palpites</span>
              </div>

              {/* Points */}
              <div className="text-right shrink-0">
                <div
                  className="text-xl font-black"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: isCurrentUser ? '#C41E3A' : isPodium ? style!.text : 'var(--foreground)',
                  }}
                >
                  {user.points}
                </div>
                <div className="text-xs text-muted-foreground">pts</div>
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
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">Como funciona a pontuação:</span>{' '}
          Os pontos são calculados com base na precisão dos seus palpites. Continue fazendo palpites para aumentar sua pontuação!
        </p>
      </div>
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
        <div className="text-xs text-muted-foreground font-medium mb-0.5">{label}</div>
        <div
          className="text-3xl font-black text-foreground"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
