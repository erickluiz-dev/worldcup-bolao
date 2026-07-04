import { api } from "./api";
import { RankingUser } from "../types/Ranking";

export async function getRanking(): Promise<RankingUser[]> {

    const response = await api.get("/ranking");

    return response.data;

}