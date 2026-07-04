import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

import {
    getPredictionsByUser,
    savePrediction,
    deletePrediction,
    clearPredictions,
} from "../services/predictionService";

/* ==========================================================
 * Interfaces
 * ========================================================== */
import type { Prediction } from "../types/Prediction";

interface PredictionInput {
    matchId: number;
    team1Score: number;
    team2Score: number;
}

interface PredictionsContextType {
    predictions: Record<number, Prediction>;

    addPrediction: (
        prediction: PredictionInput
    ) => Promise<void>;

    removePrediction: (
        matchId: number
    ) => Promise<void>;

    clearAllPredictions: () => Promise<void>;

    refreshPredictions: () => Promise<void>;
}

/* ==========================================================
 * Context
 * ========================================================== */

const PredictionsContext = createContext<
    PredictionsContextType | undefined
>(undefined);

/* ==========================================================
 * Provider
 * ========================================================== */

export function PredictionsProvider({
    children,
}: {
    children: ReactNode;
}) {

    const { user } = useAuth();

    const [predictions, setPredictions] =
        useState<Record<number, Prediction>>({});

    /* ======================================================
     * Carregar palpites
     * ====================================================== */

    async function refreshPredictions() {

        if (!user) {
            setPredictions({});
            return;
        }

        try {

            const data =
                await getPredictionsByUser(user.id);

            const map: Record<
                number,
                Prediction
            > = {};

            data.forEach(
                (prediction: Prediction) => {

                    map[
                        prediction.match_id
                    ] = prediction;
                }
            );

            setPredictions(map);

        } catch (error) {

            console.error(
                "Erro ao carregar palpites:",
                error
            );
        }
    }

    useEffect(() => {

        if (user) {
            refreshPredictions();
        } else {
            setPredictions({});
        }

    }, [user]);

    /* ======================================================
     * Salvar palpite
     * ====================================================== */

    async function addPrediction(
        prediction: PredictionInput
    ) {

        if (!user) {
            
            return;
        }

        const payload: Prediction = {
            user_id: user.id,
            match_id: prediction.matchId,
            home_score: prediction.team1Score,
            away_score: prediction.team2Score,
        };

        console.log("Payload:", payload);

             try {

            const saved =
                await savePrediction(payload);


            setPredictions((prev) => ({
                ...prev,
                [saved.match_id]: saved,
            }));

        } catch (error) {

            console.error(
                "Erro ao salvar palpite:",
                error
            );
        }
    }

    /* ======================================================
     * Remover palpite
     * ====================================================== */

    async function removePrediction(
        matchId: number
    ) {

        const prediction =
            predictions[matchId];

        if (!prediction?.id) return;

        try {

            await deletePrediction(
                prediction.id
            );

            setPredictions((prev) => {

                const copy = { ...prev };

                delete copy[matchId];

                return copy;
            });

        } catch (error) {

            console.error(
                "Erro ao remover palpite:",
                error
            );
        }
    }

    /* ======================================================
     * Limpar palpites
     * ====================================================== */

    async function clearAllPredictions() {

        if (!user) return;

        try {

            await clearPredictions(user.id);

            setPredictions({});

        } catch (error) {

            console.error(
                "Erro ao limpar palpites:",
                error
            );
        }
    }

    /* ======================================================
     * Provider
     * ====================================================== */

    return (
        <PredictionsContext.Provider
            value={{
                predictions,
                addPrediction,
                removePrediction,
                clearAllPredictions,
                refreshPredictions,
            }}
        >
            {children}
        </PredictionsContext.Provider>
    );
}

/* ==========================================================
 * Hook
 * ========================================================== */

export function usePredictions() {

    const context =
        useContext(PredictionsContext);

    if (!context) {

        throw new Error(
            "usePredictions deve ser utilizado dentro de PredictionsProvider"
        );
    }

    return context;
}
