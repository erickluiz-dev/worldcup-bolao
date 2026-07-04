from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.ranking_service import RankingService

router = APIRouter(
    prefix="/api/ranking",
    tags=["Ranking"],
)


@router.get("/")
def get_ranking(
    db: Session = Depends(get_db),
):
    """
    Retorna o ranking geral dos usuários.
    """
    return RankingService.get_ranking(db)


@router.get("/winner")
def get_winner(
    db: Session = Depends(get_db),
):
    """
    Retorna o primeiro colocado do ranking.
    """
    ranking = RankingService.get_ranking(db)

    if not ranking:
        raise HTTPException(
            status_code=404,
            detail="Nenhum usuário encontrado.",
        )

    return ranking[0]


@router.get("/user/{user_id}")
def get_user_position(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Retorna a posição de um usuário no ranking.
    """

    user = RankingService.get_user_position(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado no ranking.",
        )

    return user