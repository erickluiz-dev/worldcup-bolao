import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Check, Minus, Plus } from "lucide-react";
import type { Team as TeamType } from "../types/Team";
import { Match } from "../types/Match";
import { usePredictions } from "../context/PredictionsContext";

interface MatchCardProps {
  match: Match;
  accentColor?: string;
}

const STAGE_COLORS = {
  GROUP: "#2563EB",          // azul

  ROUND_OF_32: "#8B5CF6",    // roxo

  ROUND_OF_16: "#C41E3A",    // vermelho

  QUARTER_FINAL: "#F97316",  // laranja

  SEMI_FINAL: "#7C3AED",     // violeta

  THIRD_PLACE: "#B45309",    // bronze

  FINAL: "#FACC15",          // dourado
};

export function MatchCard({
  match,
  accentColor = "#C41E3A",
}: MatchCardProps) {
  const { predictions, addPrediction } = usePredictions();

  const stageColor =
    STAGE_COLORS[match.stage] ?? accentColor;

  const prediction = predictions[match.id];

  const [homeScore, setHomeScore] = useState(
    prediction?.home_score ?? 0
  );

  const [awayScore, setAwayScore] = useState(
    prediction?.away_score ?? 0
  );

  const [saved, setSaved] = useState(false);

  useEffect(() => {

    if (!prediction) return;

    setHomeScore(prediction.home_score);

    setAwayScore(prediction.away_score);

  }, [prediction]);

  function clamp(value: number) {
    return Math.max(0, Math.min(20, value));
  }

  function savePrediction() {
    addPrediction({
      matchId: match.id,
      team1Score: homeScore,
      team2Score: awayScore,
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  const hasPrediction = prediction !== undefined;

  const matchDateTime = new Date(`${match.date}T${match.time}`);

  const formattedDate =
    matchDateTime.toLocaleDateString("pt-BR");

  const formattedTime =
    matchDateTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const predictionClosed =
    new Date() >
    new Date(matchDateTime.getTime() + 15 * 60 * 1000);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: hasPrediction
          ? "linear-gradient(135deg,#00A55015 0%,#10142A 60%)"
          : "var(--card)",

        border: hasPrediction
          ? "1px solid #00A55040"
          : "1px solid rgba(255,255,255,0.08)",

        boxShadow: hasPrediction
          ? "0 4px 24px rgba(0,165,80,.12)"
          : "0 2px 12px rgba(0,0,0,.40)",
      }}
    >
      <div
        className="h-1"
        style={{
          backgroundColor: stageColor,
        }}
      />

      <div className="p-5">

        <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-muted-foreground">

          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formattedDate}
          </div>

          <div className="flex items-center gap-1">
            <Clock className="size-3" />
              {formattedTime}
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="size-3" />

            <span className="truncate max-w-40">
              {match.stadium.name}
            </span>

          </div>

          {hasPrediction && (
            <div className="ml-auto flex items-center gap-1 text-[#00A550] font-semibold">

              <Check className="size-3" />

              Salvo

            </div>
          )}

        </div>

        <div className="flex items-center gap-4">

          <Team
            team={match.home_team}
          />

          <div className="flex items-center gap-2">

            <ScoreInput
              value={homeScore}
              onChange={(v) => setHomeScore(clamp(v))}
              accentColor={accentColor}
            />

            <span className="font-bold text-lg text-muted-foreground">
              ×
            </span>

            <ScoreInput
              value={awayScore}
              onChange={(v) => setAwayScore(clamp(v))}
              accentColor={accentColor}
            />

          </div>

          <Team
            team={match.away_team}
          />

        </div>

        <button
          onClick={savePrediction}
          disabled={predictionClosed}
          className="w-full mt-5 py-2.5 rounded-xl font-bold uppercase tracking-wide transition-all flex justify-center items-center gap-2"
          style={
            predictionClosed
              ? {
                  backgroundColor: "#2a2a2a",
                  color: "#bbb",
                  cursor: "not-allowed",
                  opacity: 0.7,
                }
              : saved
              ? {
                  backgroundColor: "#00A550",
                  color: "#fff",
                }
              : hasPrediction
              ? {
                  backgroundColor: stageColor + "22",
                  color: stageColor,
                  border: `1px solid ${stageColor}50`,
                }
              : {
                  backgroundColor: stageColor,
                  color: "#fff",
                  boxShadow: `0 4px 16px ${stageColor}50`,
                }
          }
        >
          {predictionClosed ? (
              "Palpites Encerrados"
          ) : saved ? (
              <>
                  <Check className="size-4" />
                  Salvo!
              </>
          ) : hasPrediction ? (
              "Atualizar Palpite"
          ) : (
              "Salvar Palpite"
          )}
        </button>
      </div>
    </div>
  );
}

function Team({
    team,
}: {
    team: TeamType;
}) {
    return (
        <div className="flex-1 flex flex-col items-center gap-2">

            <img
                src={team.flag}
                alt={team.name}
                className="w-14 h-14 object-contain"
            />

            <div className="text-center text-sm font-semibold leading-tight">
                {team.name}
            </div>

        </div>
    );
}

function ScoreInput({
  value,
  onChange,
  stageColor,
}: {
  value: number;
  onChange: (value: number) => void;
  stageColor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">

      <button
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-lg flex justify-center items-center"
        style={{
          backgroundColor: "rgba(255,255,255,.06)",
        }}
      >
        <Plus className="size-4" />
      </button>

      <div
        className="w-12 h-12 rounded-xl flex justify-center items-center text-2xl font-black"
        style={{
          backgroundColor: stageColor + "18",
          border: `1px solid ${stageColor}40`,
        }}
      >
        {value}
      </div>

      <button
        onClick={() => onChange(value - 1)}
        className="w-7 h-7 rounded-lg flex justify-center items-center"
        style={{
          backgroundColor: "rgba(255,255,255,.06)",
        }}
      >
        <Minus className="size-4" />
      </button>

    </div>
  );
}