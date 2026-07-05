import { Prediction } from "../types/Prediction";

const API_URL = `${import.meta.env.VITE_API_URL}/predictions/`;

export async function getPredictions(): Promise<Prediction[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erro ao carregar palpites");
  }

  return response.json();
}

export async function getPredictionsByUser(
  userId: number
): Promise<Prediction[]> {
  const response = await fetch(`${API_URL}/user/${userId}`);

  if (!response.ok) {
    throw new Error("Erro ao carregar palpites do usuário");
  }

  return response.json();
}

export async function savePrediction(
  prediction: Prediction
): Promise<Prediction> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prediction),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar palpite");
  }

  return response.json();
}

export async function deletePrediction(
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir palpite");
  }
}

export async function clearPredictions(
  userId: number
): Promise<void> {
  const response = await fetch(`${API_URL}/user/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao limpar palpites");
  }
}