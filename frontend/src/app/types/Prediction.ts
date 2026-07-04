export interface Prediction {
    id?: number;
    user_id: number;
    match_id: number;
    home_score: number;
    away_score: number;
    created_at?: string;
}