import { useEffect, useMemo, useState } from "react";

import PageHeader from "./PageHeader";
import DataTable, { DataTableColumn } from "./DataTable";
import FormModal from "./FormModal";
import ConfirmDialog from "./ConfirmDialog";

import {
    getMatches,
    createMatch,
    updateMatch,
    deleteMatch,
    publishResult,
} from "../../services/matchService";

import { getTeams } from "../../services/teamService";
import { getStadiums } from "../../services/stadiumService";

import type {
    Match,
    MatchResult,
    MatchStage,
} from "../../types/Match";

import type { Team } from "../../types/Team";
import type { Stadium } from "../../types/Stadium";

interface MatchForm {

    home_team_id: number;

    away_team_id: number;

    stadium_id: number;

    date: string;

    stage: MatchStage;

    group: string;

    round: number;

    home_score: number;

    away_score: number;

    finished: boolean;

}

const EMPTY_FORM: MatchForm = {

    home_team_id: 0,

    away_team_id: 0,

    stadium_id: 0,

    date: "",

    stage: "GROUP",

    group: "A",

    round: 1,

    home_score: 0,

    away_score: 0,

    finished: false,

};

export default function MatchesAdmin() {

    const [matches, setMatches] =

        useState<Match[]>([]);

    const [teams, setTeams] =

        useState<Team[]>([]);

    const [stadiums, setStadiums] =

        useState<Stadium[]>([]);

    const [loading, setLoading] =

        useState(true);

    const [saving, setSaving] =

        useState(false);

    const [search, setSearch] =

        useState("");

    const [editing, setEditing] =

        useState(false);

    const [formOpen, setFormOpen] =

        useState(false);

    const [resultOpen, setResultOpen] =

        useState(false);

    const [deleteOpen, setDeleteOpen] =

        useState(false);

    const [selectedMatch, setSelectedMatch] =

        useState<Match | null>(null);

    const [form, setForm] =

        useState<MatchForm>(EMPTY_FORM);

    const [result, setResult] =

        useState<MatchResult>({

            home_score: 0,

            away_score: 0,

            finished: true,

        });

    async function loadData() {

        setLoading(true);

        try {

            const [

                matchesData,

                teamsData,

                stadiumsData,

            ] = await Promise.all([

                getMatches(),

                getTeams(),

                getStadiums(),

            ]);

            setMatches(matchesData);

            setTeams(teamsData);

            setStadiums(stadiumsData);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadData();

    }, []);

    function updateField<K extends keyof MatchForm>(

        field: K,

        value: MatchForm[K],

    ) {

        setForm(previous => ({

            ...previous,

            [field]: value,

        }));

    }

    function resetForm() {

        setForm(EMPTY_FORM);

        setSelectedMatch(null);

        setEditing(false);

    }

    const filteredMatches = useMemo(() => {

        if (!search.trim()) {

            return matches;

        }

        const query = search.toLowerCase();

        return matches.filter(match =>

            match.home_team.name
                .toLowerCase()
                .includes(query)

            ||

            match.away_team.name
                .toLowerCase()
                .includes(query)

            ||

            match.stadium.name
                .toLowerCase()
                .includes(query)

            ||

            (match.group ?? "")
                .toLowerCase()
                .includes(query)

            ||

            match.stage
                .toLowerCase()
                .includes(query)

        );

    }, [

        matches,

        search,

    ]);
    /* ==========================================================
     * Nova Partida
     * ========================================================== */

    function handleNew() {

        resetForm();

        setFormOpen(true);

    }

    function handleCloseForm() {

        resetForm();

        setFormOpen(false);

    }

    /* ==========================================================
     * Editar
     * ========================================================== */

    function handleEdit(match: Match) {

        setEditing(true);

        setSelectedMatch(match);

        setForm({

            home_team_id: match.home_team.id,

            away_team_id: match.away_team.id,

            stadium_id: match.stadium.id,

            date: `${match.date}T${match.time}`,

            stage: match.stage,

            group: match.group ?? "",

            round: match.round,

            home_score: match.home_score ?? 0,

            away_score: match.away_score ?? 0,

            finished: match.finished,

        });

        setFormOpen(true);

    }

    /* ==========================================================
     * Salvar
     * ========================================================== */

    async function handleSave() {

        try {

            setSaving(true);

            const homeTeam = teams.find(

                team => team.id === form.home_team_id

            );

            const awayTeam = teams.find(

                team => team.id === form.away_team_id

            );

            const stadium = stadiums.find(

                stadium => stadium.id === form.stadium_id

            );

            if (!homeTeam) {

                throw new Error(
                    "Selecione a equipe mandante."
                );

            }

            if (!awayTeam) {

                throw new Error(
                    "Selecione a equipe visitante."
                );

            }

            if (!stadium) {

                throw new Error(
                    "Selecione um estádio."
                );

            }

            if (homeTeam.id === awayTeam.id) {

                throw new Error(
                    "Mandante e visitante não podem ser iguais."
                );

            }

            const [date, time] = form.date.split("T");

            const payload = {

                home_team_id: form.home_team_id,

                away_team_id: form.away_team_id,

                stadium_id: form.stadium_id,

                date,

                time,

                stage: form.stage,

                group: form.group,

                round: form.round,

                home_score: form.home_score,

                away_score: form.away_score,

                finished: form.finished,

            };

            if (editing && selectedMatch) {

                const updated = await updateMatch({

                    id: selectedMatch.id,

                    ...payload,

                });

                setMatches(previous =>

                    previous.map(match =>

                        match.id === updated.id

                            ? updated

                            : match

                    )

                );

            }

            else {

                const created = await createMatch(
                    payload
                );

                setMatches(previous => [

                    ...previous,

                    created,

                ]);

            }

            handleCloseForm();

        }

        catch (error) {

            console.error(error);

            alert(

                error instanceof Error

                    ? error.message

                    : "Erro ao salvar a partida."

            );

        }

        finally {

            setSaving(false);

        }

    }

    /* ==========================================================
     * Excluir
     * ========================================================== */

    function handleDeleteClick(match: Match) {

        setSelectedMatch(match);

        setDeleteOpen(true);

    }

    function handleCancelDelete() {

        setDeleteOpen(false);

        setSelectedMatch(null);

    }

    async function handleDelete() {

        if (!selectedMatch) {

            return;

        }

        try {

            setSaving(true);

            await deleteMatch(selectedMatch.id);

            setMatches(previous =>

                previous.filter(

                    match =>

                        match.id !== selectedMatch.id

                )

            );

            handleCancelDelete();

        }

        catch (error) {

            console.error(error);

            alert(

                error instanceof Error

                    ? error.message

                    : "Erro ao excluir partida."

            );

        }

        finally {

            setSaving(false);

        }

    }

    /* ==========================================================
     * Resultado
     * ========================================================== */

    function handleOpenResult(match: Match) {

        setSelectedMatch(match);

        setResult({

            home_score: match.home_score ?? 0,

            away_score: match.away_score ?? 0,

            finished: true,

        });

        setResultOpen(true);

    }

    function handleCloseResult() {

        setResultOpen(false);

        setSelectedMatch(null);

    }

    async function handlePublishResult() {

        if (!selectedMatch) {

            return;

        }

        try {

            setSaving(true);

            const updated = await publishResult(

                selectedMatch.id,

                result,

            );

            setMatches(previous =>

                previous.map(match =>

                    match.id === updated.id

                        ? updated

                        : match

                )

            );

            handleCloseResult();

        }

        catch (error) {

            console.error(error);

            alert(

                error instanceof Error

                    ? error.message

                    : "Erro ao publicar resultado."

            );

        }

        finally {

            setSaving(false);

        }

    }
        /* ==========================================================
     * Colunas da Tabela
     * ========================================================== */

    const columns: DataTableColumn<Match>[] = [

        {

            key: "home_team",

            title: "Partida",

            render: (_, match) => (

                <div>

                    <strong>

                        {match.home_team.name}

                    </strong>

                    {" × "}

                    <strong>

                        {match.away_team.name}

                    </strong>

                </div>

            ),

        },

        {

            key: "group",

            title: "Grupo",

            render: (_, match) => (

                <span>

                    {match.group ?? "-"}

                </span>

            ),

        },

        {

            key: "stage",

            title: "Fase",

            render: (_, match) => (

                <span>

                    {match.stage}

                </span>

            ),

        },

        {

            key: "round",

            title: "Rodada",

            render: (_, match) => (

                <span>

                    {match.round}

                </span>

            ),

        },

        {

            key: "stadium",

            title: "Estádio",

            render: (_, match) => (

                <div>

                    <div>

                        {match.stadium.name}

                    </div>

                    <small>

                        {match.stadium.city}

                    </small>

                </div>

            ),

        },

        {

            key: "date",

            title: "Data",

            render: (_, match) => (

                <div>

                    <div>

                        {new Date(

                            match.date

                        ).toLocaleDateString(

                            "pt-BR"

                        )}

                    </div>

                    <small>

                        {match.time}

                    </small>

                </div>

            ),

        },

        {

            key: "status",

            title: "Status",

            render: (_, match) => (

                match.finished

                    ? (

                        <strong>

                            {match.home_score}

                            {" x "}

                            {match.away_score}

                        </strong>

                    )

                    : (

                        <span>

                            —

                        </span>

                    )

            ),

        },

        {

            key: "finished",

            title: "Status",

            render: (_, match) => (

                <span>

                    {

                        match.finished

                            ? "Finalizada"

                            : "Agendada"

                    }

                </span>

            ),

        },

    ];
        /* ==========================================================
     * Botão Novo
     * ========================================================== */

    const actions = (

        <button

            className="btn btn-primary"

            onClick={handleNew}

        >

            Nova Partida

        </button>

    );

    /* ==========================================================
     * Renderização
     * ========================================================== */

    return (

        <>

            <PageHeader

                title="Partidas"

                subtitle="Gerencie todas as partidas da Copa do Mundo"

                actions={actions}

            />

            <div className="mb-4">

                <input

                    className="input"

                    placeholder="Pesquisar..."

                    value={search}

                    onChange={(event)=>

                        setSearch(

                            event.target.value

                        )

                    }

                />

            </div>

            <DataTable

                columns={columns}

                data={filteredMatches}

                loading={loading}

                emptyMessage="Nenhuma partida encontrada."

                onEdit={handleEdit}

                onDelete={handleDeleteClick}

                getRowKey={(match)=>

                    match.id

                }

            />

            <FormModal

                open={formOpen}

                title={

                    editing

                        ? "Editar Partida"

                        : "Nova Partida"

                }

                loading={saving}

                submitText={

                    editing

                        ? "Salvar"

                        : "Cadastrar"

                }

                onClose={handleCloseForm}

                onSubmit={handleSave}

            >

                <div className="form-grid">

                    <label>

                        Mandante

                    </label>

                    <select

                        value={form.home_team_id}

                        onChange={(event)=>

                            updateField(

                                "home_team_id",

                                Number(

                                    event.target.value

                                )

                            )

                        }

                    >

                        <option value={0}>

                            Selecione

                        </option>

                        {teams.map(team=>(

                            <option

                                key={team.id}

                                value={team.id}

                            >

                                {team.name}

                            </option>

                        ))}

                    </select>

                    <label>

                        Visitante

                    </label>

                    <select

                        value={form.away_team_id}

                        onChange={(event)=>

                            updateField(

                                "away_team_id",

                                Number(

                                    event.target.value

                                )

                            )

                        }

                    >

                        <option value={0}>

                            Selecione

                        </option>

                        {teams.map(team=>(

                            <option

                                key={team.id}

                                value={team.id}

                            >

                                {team.name}

                            </option>

                        ))}

                    </select>

                    <label>

                        Estádio

                    </label>

                    <select

                        value={form.stadium_id}

                        onChange={(event)=>

                            updateField(

                                "stadium_id",

                                Number(

                                    event.target.value

                                )

                            )

                        }

                    >

                        <option value={0}>

                            Selecione

                        </option>

                        {stadiums.map(stadium=>(

                            <option

                                key={stadium.id}

                                value={stadium.id}

                            >

                                {stadium.name}

                            </option>

                        ))}

                    </select>

                    <label>

                        Data

                    </label>

                    <input

                        type="datetime-local"

                        value={form.date}

                        onChange={(event)=>

                            updateField(

                                "date",

                                event.target.value

                            )

                        }

                    />

                    <label>

                        Grupo

                    </label>

                    <input

                        value={form.group}

                        onChange={(event)=>

                            updateField(

                                "group",

                                event.target.value.toUpperCase()

                            )

                        }

                    />

                    <label>

                        Rodada

                    </label>

                    <input

                        type="number"

                        min={1}

                        value={form.round}

                        onChange={(event)=>

                            updateField(

                                "round",

                                Number(

                                    event.target.value

                                )

                            )

                        }

                    />
                                        <label>

                        Fase

                    </label>

                    <select

                        value={form.stage}

                        onChange={(event)=>

                            updateField(

                                "stage",

                                event.target.value as MatchStage

                            )

                        }

                    >

                        <option value="GROUP">

                            Fase de Grupos

                        </option>

                        <option value="ROUND_OF_32">

                            32 Avos

                        </option>

                        <option value="ROUND_OF_16">

                            Oitavas

                        </option>

                        <option value="QUARTER_FINAL">

                            Quartas

                        </option>

                        <option value="SEMI_FINAL">

                            Semifinal

                        </option>

                        <option value="THIRD_PLACE">

                            Terceiro Lugar

                        </option>

                        <option value="FINAL">

                            Final

                        </option>

                    </select>

                </div>

            </FormModal>

            <FormModal

                open={resultOpen}

                title="Publicar Resultado"

                submitText="Publicar"

                loading={saving}

                onClose={handleCloseResult}

                onSubmit={handlePublishResult}

            >

                <div className="form-grid">

                    <label>

                        Gols Mandante

                    </label>

                    <input

                        type="number"

                        min={0}

                        value={result.home_score}

                        onChange={(event)=>

                            setResult(previous=>({

                                ...previous,

                                home_score:Number(

                                    event.target.value

                                )

                            }))

                        }

                    />

                    <label>

                        Gols Visitante

                    </label>

                    <input

                        type="number"

                        min={0}

                        value={result.away_score}

                        onChange={(event)=>

                            setResult(previous=>({

                                ...previous,

                                away_score:Number(

                                    event.target.value

                                )

                            }))

                        }

                    />

                </div>

            </FormModal>

            <ConfirmDialog

                open={deleteOpen}

                loading={saving}

                title="Excluir Partida"

                message={

                    selectedMatch

                        ? `Deseja realmente excluir ${selectedMatch.home_team.name} x ${selectedMatch.away_team.name}?`

                        : ""

                }

                confirmText="Excluir"

                cancelText="Cancelar"

                variant="danger"

                onConfirm={handleDelete}

                onCancel={handleCancelDelete}

            />

        </>

    );

}