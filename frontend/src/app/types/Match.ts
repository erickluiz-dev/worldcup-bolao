import type { Team } from "./Team";
import type { Stadium } from "./Stadium";

/* ==========================================================
 * Fases da Copa
 * ========================================================== */

export type MatchStage =
    | "GROUP"
    | "ROUND_OF_32"
    | "ROUND_OF_16"
    | "QUARTER_FINAL"
    | "SEMI_FINAL"
    | "THIRD_PLACE"
    | "FINAL";

/* ==========================================================
 * Partida
 * ========================================================== */

export interface Match {
    /**
     * Identificador da partida.
     */
    id: number;

    /**
     * Data da partida.
     */
    date: string;

    /**
     * Horário da partida.
     */
    time: string;

    /**
     * Grupo (A, B, C...)
     */
    group?: string;

    /**
     * Fase da competição.
     */
    stage: MatchStage;

    /**
     * Rodada.
     */
    round: number;

    /**
     * Resultado oficial.
     */
    home_score?: number;

    away_score?: number;

    qualified_team_id?: number;

    /**
     * Indica se a partida foi finalizada.
     */
    finished: boolean;

    /**
     * Dados completos.
     */
    home_team: Team;

    away_team: Team;

    stadium: Stadium;

    /**
     * Datas de auditoria.
     */
    created_at?: string;

    updated_at?: string;
}
/* ==========================================================
 * Criação
 * ========================================================== */

export interface CreateMatchRequest {

    home_team_id: number;

    away_team_id: number;

    stadium_id: number;

    date: string;

    time: string;

    stage: MatchStage;

    group?: string;

    round: number;

    home_score?: number;

    away_score?: number;

    qualified_team_id?: number;

    finished: boolean;

}

/* ==========================================================
 * Atualização
 * ========================================================== */

export interface UpdateMatchRequest {

    id: number;

    home_team_id: number;

    away_team_id: number;

    stadium_id: number;

    date: string;

    time: string;

    stage: MatchStage;

    group?: string;

    round: number;

    home_score?: number;

    away_score?: number;

    qualified_team_id?: number;

    finished: boolean;

}
/* ==========================================================
 * Resultado
 * ========================================================== */

export interface MatchResult {
    home_score: number;

    away_score: number;

    qualified_team_id?: number;

    finished: boolean;
}

/* ==========================================================
 * Filtros
 * ========================================================== */

export interface MatchFilters {
    stage?: MatchStage;

    group?: string;

    round?: number;

    stadium_id?: number;

    team_id?: number;

    finished?: boolean;
}