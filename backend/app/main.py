from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.teams import router as teams_router
from app.api.stadiums import router as stadiums_router
from app.api.matches import router as matches_router
from app.api.predictions import router as predictions_router
from app.api.results import router as results_router
from app.api.ranking import router as ranking_router
from app.api.auth import router as auth_router
from app.api import users



app = FastAPI(
    title="Copa do Mundo Bolão API",
    version="2.0.0",
    description="API oficial do sistema de Bolão da Copa do Mundo",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",

    "https://worldcup-bolao-one.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

# ==========================================================
# Rotas da API
# ==========================================================

# ==========================================================
# Autenticação
# ==========================================================

app.include_router(auth_router)

# ==========================================================
# Cadastro
# ==========================================================

app.include_router(teams_router)
app.include_router(stadiums_router)
app.include_router(matches_router)

# ==========================================================
# Bolão
# ==========================================================

app.include_router(predictions_router)
app.include_router(results_router)
app.include_router(ranking_router)


@app.get("/")
def root():
    return {
        "application": "Bolão Copa do Mundo",
        "version": "2.0.0",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }