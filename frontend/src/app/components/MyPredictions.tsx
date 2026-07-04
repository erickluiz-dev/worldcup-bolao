import { useEffect, useState } from 'react';
import { usePredictions } from '../context/PredictionsContext';

import { getMatches } from '../services/matchService';
import { Match } from '../types/Match';

import {
  Trash2,
  Trophy,
  AlertCircle,
  Target
} from 'lucide-react';

const PHASE_COLORS: Record<string, string> = {
  GROUP: '#00AEEF',
  ROUND_OF_32: '#3400ef',
  ROUND_OF_16: '#C41E3A',
  QUARTER_FINAL: '#F5821F',
  SEMI_FINAL: '#753BBD',
  THIRD_PLACE: "#8D6E63",
  FINAL: '#FDC300',
};

const PHASE_NAMES: Record<string, string> = {
  GROUP: 'Fase de Grupos',
  ROUND_OF_32: 'Dezesseis avos de final',
  ROUND_OF_16: 'Oitavas de Final',
  QUARTER_FINAL: 'Quartas de Final',
  SEMI_FINAL: 'Semifinais',
  THIRD_PLACE: '3º Lugar',
  FINAL: 'Final',
};

export function MyPredictions() {

  const {
      predictions,
      clearAllPredictions,
  } = usePredictions();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadMatches() {

      try {

        const data = await getMatches();

        setMatches(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadMatches();

  }, []);

  const predictionsList = Object.values(predictions)
    .map((prediction) => {

      const match = matches.find(
        (m) => m.id === prediction.match_id
      );

      return {
        ...prediction,
        match,
      };

    })
    .filter((item) => item.match);

  const groupedByPhase = predictionsList.reduce((acc, prediction) => {

    const phase = prediction.match.stage;

    if (!acc[phase]) {
      acc[phase] = [];
    }

    acc[phase].push(prediction);

    return acc;

  }, {} as Record<string, typeof predictionsList>);

  function handleClearAll() {

    if (
      confirm(
        'Tem certeza que deseja apagar todos os seus palpites?'
      )
    ) {

      clearAllPredictions();

    }

  }

  if (loading) {

    return (

      <div className="flex justify-center items-center py-20">

        <span className="text-muted-foreground">
          Carregando partidas...
        </span>

      </div>

    );

  }

  if (predictionsList.length === 0) {

    return (

      <div className="text-center py-24">

        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
          style={{
            background: 'rgba(196,30,58,0.12)',
            border: '1px solid rgba(196,30,58,0.2)',
          }}
        >

          <AlertCircle className="size-9 text-primary" />

        </div>

        <h2
          className="text-4xl font-black uppercase tracking-tight text-foreground mb-2"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
          }}
        >

          Nenhum Palpite Ainda

        </h2>

        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">

          Vá para a página de Jogos e comece a fazer seus palpites!

        </p>

      </div>

    );

  }

  return (

    <div>

      <div className="flex items-start justify-between mb-8">

        <div>

          <h2
            className="text-5xl font-black uppercase tracking-tight text-foreground mb-1"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >

            Meus Palpites

          </h2>

          <p className="text-muted-foreground">

            Você fez{' '}

            <span className="text-primary font-bold">

              {predictionsList.length}

            </span>

            {' '}palpite
            {predictionsList.length !== 1 ? 's' : ''}

          </p>

        </div>

        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all text-destructive hover:bg-destructive/10 border border-destructive/30"
        >

          <Trash2 className="size-4" />

          Limpar Todos

        </button>

      </div>

      <div className="space-y-8">

        {Object.entries(groupedByPhase).map(([phase, preds]) => {

          const accentColor =
            PHASE_COLORS[phase] ?? '#C41E3A';

          return (

            <div key={phase}>

              <div className="flex items-center gap-3 mb-4">

                <div
                  className="w-1 h-6 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                  }}
                />

                <h3
                  className="text-2xl font-black uppercase tracking-wide text-foreground"
                  style={{
                    fontFamily:
                      "'Barlow Condensed', sans-serif",
                  }}
                >

                  <Trophy
                    className="inline size-5 mr-2 mb-0.5"
                    style={{
                      color: accentColor,
                    }}
                  />

                  {PHASE_NAMES[phase]}

                </h3>

                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      `${accentColor}20`,
                    color: accentColor,
                  }}
                >

                  {preds.length}

                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">               
                {preds.map((prediction) => {

                  const match = prediction.match!;

                  return (

                    <div
                      key={prediction.match_id}
                      className="rounded-xl p-4 transition-all"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >

                      <div className="flex items-center justify-between mb-3">

                        <div className="text-xs text-muted-foreground">

                          {match.date} • {match.time}

                        </div>

                        {match.group && (

                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${accentColor}20`,
                              color: accentColor,
                            }}
                          >

                            Grupo {match.group}

                          </span>

                        )}

                      </div>

                      <div className="flex items-center justify-between mb-3">

                        <div className="flex items-center gap-2 flex-1 min-w-0">

                          <img
                            src={match.home_team.flag}
                            alt={match.home_team.name}
                            className="w-8 h-8 object-contain"
                          />

                          <span className="text-sm font-semibold truncate">

                            {match.home_team.name}

                          </span>

                        </div>

                        <div
                          className="px-3 py-1 rounded-lg font-black text-lg"
                          style={{
                            backgroundColor: `${accentColor}20`,
                            color: accentColor,
                          }}
                        >

                          {prediction.home_score}
                          {' × '}
                          {prediction.away_score}

                        </div>

                        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">

                          <span className="text-sm font-semibold truncate">

                            {match.away_team.name}

                          </span>

                          <img
                            src={match.away_team.flag}
                            alt={match.away_team.name}
                            className="w-8 h-8 object-contain"
                          />

                        </div>

                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">

                        <span>

                          {match.stadium.name}

                        </span>

                        <span>

                          {match.stadium.city}

                        </span>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          );

        })}

      </div>

      <div
        className="mt-8 rounded-xl p-4 flex items-start gap-3"
        style={{
          background: 'rgba(196,30,58,0.08)',
          border: '1px solid rgba(196,30,58,0.2)',
        }}
      >

        <Target
          className="size-5 text-primary mt-0.5 shrink-0"
        />

        <p className="text-sm text-muted-foreground">

          <span className="text-foreground font-semibold">

            Sistema de Pontuação

          </span>

          <br />

          ✔ Acerto do placar: <strong>3 pontos</strong>

          <br />

          ✔ Acerto do vencedor ou empate:
          <strong> 1 pontos</strong>

          <br />

          ✔ Participação:
          <strong> 0 ponto</strong>

        </p>

      </div>

    </div>

  );

}