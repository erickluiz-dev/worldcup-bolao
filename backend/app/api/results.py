from fastapi import APIRouter, HTTPException, status

from app.models.result import Result
from app.services.result_service import ResultService

router = APIRouter(
    prefix="/api/results",
    tags=["Results"],
)


@router.get(
    "",
    response_model=list[Result],
    summary="Lista todos os resultados oficiais",
)
def get_results():
    """
    Retorna todos os resultados cadastrados.
    """
    return ResultService.get_results()


@router.get(
    "/{match_id}",
    response_model=Result,
    summary="Busca o resultado de uma partida",
)
def get_result(match_id: int):
    """
    Retorna o resultado oficial de uma partida.
    """
    result = ResultService.get_result(match_id)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resultado não encontrado.",
        )

    return result


@router.post(
    "",
    response_model=Result,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastra um resultado oficial",
)
def create_result(result: Result):
    """
    Salva um novo resultado oficial.

    Após salvar, o backend recalcula automaticamente:

    • pontuação dos palpites;
    • ranking dos usuários.
    """
    return ResultService.save_result(result)


@router.put(
    "/{match_id}",
    response_model=Result,
    summary="Atualiza um resultado oficial",
)
def update_result(match_id: int, result: Result):
    """
    Atualiza o resultado de uma partida.

    O cálculo da pontuação é executado novamente.
    """
    result.match_id = match_id

    updated = ResultService.save_result(result)

    return updated


@router.delete(
    "/{match_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove um resultado oficial",
)
def delete_result(match_id: int):
    """
    Remove um resultado cadastrado.
    """
    deleted = ResultService.delete_result(match_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resultado não encontrado.",
        )

    return None