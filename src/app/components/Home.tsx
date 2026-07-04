import { useEffect, useState } from "react";
import { Match } from "../types/Match";
import { api } from "../services/api";
import { MatchCard } from "./MatchCard";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";

const GROUP_COLORS: Record<string, string> = {
  A: "#E8192C",
  B: "#F5821F",
  C: "#FDC300",
  D: "#00A550",
  E: "#00AEEF",
  F: "#003DA5",
  G: "#753BBD",
  H: "#E5007E",
  I: "#FF6F00",
  J: "#6A1B9A",
  K: "#00897B",
  L: "#3949AB",
};

const STAGE_COLORS: Record<string, string> = {
  GROUP: "#2563EB",

  ROUND_OF_32: "#8B5CF6",

  ROUND_OF_16: "#C41E3A",

  QUARTER_FINAL: "#FF7A00",

  SEMI_FINAL: "#7C3AED",

  THIRD_PLACE: "#B45309",

  FINAL: "#FACC15",
};

const STAGE_LABELS: Record<string, string> = {
  GROUP: "Fase de Grupos",
  ROUND_OF_32: "32 Avos",
  ROUND_OF_16: "Oitavas",
  QUARTER_FINAL: "Quartas",
  SEMI_FINAL: "Semifinal",
  THIRD_PLACE: "3º Lugar",
  FINAL: "Final",
};

export function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

const [expandedGroups, setExpandedGroups] =
  useState<Set<string>>(new Set());
  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      const response = await api.get("/matches");

      // Exibe somente partidas que ainda não terminaram
      const pendingMatches = response.data.filter(
          (match: Match) => !match.finished
      );

      setMatches(pendingMatches);

      const opened = new Set<string>();

      pendingMatches.forEach((match) => {

          if (match.stage === "GROUP") {

              opened.add(`GROUP_${match.group}`);

          } else {

              opened.add(match.stage);

          }

      });

      setExpandedGroups(opened);
      
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
    } finally {
      setLoading(false);
    }
  }

  const groupedMatches = matches.reduce((acc, match) => {

      const key =

          match.stage === "GROUP"

              ? `GROUP_${match.group}`

              : match.stage;

      if (!acc[key]) {

          acc[key] = [];

      }

      acc[key].push(match);

      return acc;

  }, {} as Record<string, Match[]>);

  const orderedGroups = Object.keys(groupedMatches).sort();

  function toggleGroup(group: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);

      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }

      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-muted-foreground text-lg">
          Carregando partidas...
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* Hero */}

      <div className="mb-8">

        <h2
          className="text-5xl font-black uppercase tracking-tight text-foreground mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Faça seus Palpites
        </h2>

        <p className="text-muted-foreground text-base">
          Escolha os placares dos jogos da Copa do Mundo 2026.
        </p>

      </div>

      {/* Lista de grupos */}

      <div className="space-y-6">

        {orderedGroups.map((group) => {

          const matchList = groupedMatches[group];

          const accentColor = group.startsWith("GROUP_")
            ? GROUP_COLORS[group.replace("GROUP_", "")] ?? "#2563EB"
            : STAGE_COLORS[group] ?? "#C41E3A";

          const expanded = expandedGroups.has(group);

          const title =

            group.startsWith("GROUP_")

                ? `Grupo ${group.replace("GROUP_", "")}`

                : STAGE_LABELS[group] ?? group;

          return (

            <div key={group}>

              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl mb-3 transition-all"
                style={{
                  background: `linear-gradient(
                      135deg,
                      ${accentColor}35 0%,
                      ${accentColor}15 100%
                  )`,
                  border: `1px solid ${accentColor}40`,
                }}
              >

                <div className="flex items-center gap-3">

                  <div
                    className="w-1.5 h-8 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />

                  <h3
                      className="text-xl font-black uppercase tracking-wide"
                      style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          color: accentColor,
                      }}
                  >
                      {title}
                  </h3>

                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${accentColor}30`,
                      color: accentColor,
                    }}
                  >
                    {matchList.length} jogo
                    {matchList.length > 1 ? "s" : ""}
                  </span>

                </div>

                {expanded ? (
                  <ChevronUp
                      className="size-5"
                      style={{
                          color: accentColor,
                      }}
                  />
                ) : (
                  <ChevronDown
                      className="size-5"
                      style={{
                          color: accentColor,
                      }}
                  />
                
                    )}

              </button>

              {expanded && (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {matchList.map((match) => (

                    <MatchCard
                      key={match.id}
                      match={match}
                      accentColor={accentColor}
                    />

                  ))}

                </div>

              )}

            </div>

          );

        })}

      </div>

      {!loading && matches.length === 0 && (

        <div className="text-center py-20">

          <Zap className="size-12 text-muted-foreground mx-auto mb-4" />

          <p className="text-muted-foreground text-lg">

            Nenhuma partida encontrada.

          </p>

        </div>

      )}

    </div>
  );
}