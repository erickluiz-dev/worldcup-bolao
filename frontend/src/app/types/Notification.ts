export interface Notification {

    id: number;

    user_id: number;

    title: string;

    message: string;

    type: "info" | "success" | "warning" | "error";

    is_read: boolean;

    created_at: string;

    match_id?: number;

    home_team_name?: string;

    away_team_name?: string;

}