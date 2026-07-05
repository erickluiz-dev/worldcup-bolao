from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models_db.prediction import Prediction
from app.schemas.prediction import (
    PredictionCreate,
    PredictionRead,
    PredictionUpdate,
)

from app.services.prediction_service import PredictionService

router = APIRouter(
    prefix="/api/predictions",
    tags=["Predictions"],
)


# ==========================================================
# GET /
# ==========================================================

@router.get("/", response_model=List[PredictionRead])
def get_predictions(
    db: Session = Depends(get_db),
):
    """
    Retorna todos os palpites.
    """
    return PredictionService.get_predictions(db)


# ==========================================================
# GET /{prediction_id}
# ==========================================================

@router.get("/{prediction_id}", response_model=PredictionRead)
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    """
    Retorna um palpite pelo ID.
    """

    prediction = PredictionService.get_prediction_by_id(
        db,
        prediction_id,
    )

    if prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Palpite não encontrado.",
        )

    return prediction


# ==========================================================
# GET /user/{user_id}
# ==========================================================

@router.get("/user/{user_id}", response_model=List[PredictionRead])
def get_predictions_by_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Retorna todos os palpites de um usuário.
    """

    return PredictionService.get_predictions_by_user(
        db,
        user_id,
    )


# ==========================================================
# GET /match/{match_id}
# ==========================================================

@router.get("/match/{match_id}", response_model=List[PredictionRead])
def get_predictions_by_match(
    match_id: int,
    db: Session = Depends(get_db),
):
    """
    Retorna todos os palpites de uma partida.
    """

    return PredictionService.get_predictions_by_match(
        db,
        match_id,
    )


# ==========================================================
# POST
# ==========================================================

@router.post(
    "",
    response_model=PredictionRead,
    status_code=status.HTTP_201_CREATED,
)
def save_prediction(
    prediction: PredictionCreate,
    db: Session = Depends(get_db),
):
    """
    Cria ou atualiza um palpite.
    """

    prediction_db = Prediction(
        user_id=prediction.user_id,
        match_id=prediction.match_id,
        home_score=prediction.home_score,
        away_score=prediction.away_score,
        points=0,
    )

    saved_prediction = PredictionService.save_prediction(

        db,

        prediction_db,

    )

    return saved_prediction


# ==========================================================
# DELETE /{prediction_id}
# ==========================================================

@router.delete("/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    """
    Remove um palpite.
    """

    deleted = PredictionService.delete_prediction(
        db,
        prediction_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Palpite não encontrado.",
        )

    return {
        "message": "Palpite removido com sucesso."
    }


# ==========================================================
# DELETE /user/{user_id}
# ==========================================================

@router.delete("/user/{user_id}")
def delete_predictions_by_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Remove todos os palpites do usuário.
    """

    PredictionService.delete_predictions_by_user(
        db,
        user_id,
    )

    return {
        "message": "Todos os palpites do usuário foram removidos."
    }