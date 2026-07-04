import { useEffect, useMemo, useState } from "react";

import type {
    Match,
    MatchResult,
} from "../../types/Match";

import {
    getMatches,
    publishResult,
} from "../../services/matchService";

import PageHeader from "./PageHeader";

import DataTable, {
    DataTableColumn,
} from "./DataTable";

import EmptyState from "./EmptyState";

import FormModal from "./FormModal";

import "./ResultsAdmin.css";

export default function ResultsAdmin() {

    /* ======================================================
     * Estados
     * ====================================================== */

    const [matches, setMatches] =
        useState<Match[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [modalOpen, setModalOpen] =
        useState(false);

    const [selectedMatch, setSelectedMatch] =
        useState<Match | null>(null);

    const [form, setForm] =
        useState<MatchResult>({
            home_score: 0,
            away_score: 0,
            finished: false,
        });

    /* ======================================================
     * Carregar partidas
     * ====================================================== */

    async function loadMatches() {

        try {

            setLoading(true);

            const data =
                await getMatches();

            setMatches(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadMatches();

    }, []);

    /* ======================================================
     * Pesquisa
     * ====================================================== */

    const filteredMatches =
        useMemo(() => {

            if (!search.trim()) {

                return matches;

            }

            const query =
                search.toLowerCase();

            return matches.filter((match) =>

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

            );

        }, [

            matches,

            search,

        ]);

    /* ======================================================
     * Colunas
     * ====================================================== */

    const columns:
        DataTableColumn<Match>[] = [

        {

            key: "home_team",

            title: "Mandante",

            render: (_, row) => (

                <div className="result-team">

                    <img
                        src={row.home_team.flag}
                        alt={row.home_team.name}
                    />

                    {row.home_team.name}

                </div>

            ),

        },

        {

            key: "away_team",

            title: "Visitante",

            render: (_, row) => (

                <div className="result-team">

                    <img
                        src={row.away_team.flag}
                        alt={row.away_team.name}
                    />

                    {row.away_team.name}

                </div>

            ),

        },

        {

            key: "date",

            title: "Data",

            render: (_, row) =>

                new Date(
                    row.date
                ).toLocaleDateString(
                    "pt-BR"
                ),

        },

        {

            key: "stadium",

            title: "Estádio",

            render: (_, row) =>

                row.stadium.name,

        },

        {

            key: "finished",

            title: "Status",

            align: "center",

            render: (_, row) => (

                row.finished

                    ? (

                        <span className="result-status finished">

                            Publicado

                        </span>

                    )

                    : (

                        <span className="result-status pending">

                            Pendente

                        </span>

                    )

            ),

        },

        {

            key: "home_score",

            title: "Resultado",

            align: "center",

            render: (_, row) => (

                row.finished

                    ? `${row.home_score} × ${row.away_score}`

                    : "- × -"

            ),

        },

    ];
    /* ======================================================
     * Abrir Modal
     * ====================================================== */

    function handleEdit(
        match: Match
    ) {

        setSelectedMatch(match);

        setForm({

            home_score:
                match.home_score ?? 0,

            away_score:
                match.away_score ?? 0,

            finished:
                match.finished,

        });

        setModalOpen(true);

    }

    /* ======================================================
     * Fechar Modal
     * ====================================================== */

    function handleClose() {

        if (saving) return;

        setModalOpen(false);

        setSelectedMatch(null);

        setForm({

            home_score: 0,

            away_score: 0,

            finished: false,

        });

    }

    /* ======================================================
     * Alterar Campo
     * ====================================================== */

    function updateField<
        K extends keyof MatchResult
    >(
        field: K,
        value: MatchResult[K]
    ) {

        setForm(previous => ({

            ...previous,

            [field]: value,

        }));

    }

    /* ======================================================
     * Salvar Resultado
     * ====================================================== */

    async function handleSave() {

        if (!selectedMatch) {

            return;

        }

        try {

            setSaving(true);

            const updated =
                await publishResult(

                    selectedMatch.id,

                    form,

                );

            setMatches(previous =>

                previous.map(match =>

                    match.id === updated.id

                        ? updated

                        : match

                )

            );

            handleClose();

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

    /* ======================================================
     * Header
     * ====================================================== */

    const headerActions = (

        <input

            type="text"

            placeholder="Pesquisar partida..."

            className="results-search"

            value={search}

            onChange={(event)=>

                setSearch(

                    event.target.value

                )

            }

        />

    );

    /* ======================================================
     * Empty State
     * ====================================================== */

    if (

        !loading &&

        filteredMatches.length === 0

    ) {

        return (

            <>

                <PageHeader

                    title="Resultados"

                    subtitle="Publique os resultados oficiais das partidas."

                    actions={headerActions}

                />

                <EmptyState

                    icon="🥅"

                    title="Nenhuma partida encontrada"

                    description="Não existem partidas cadastradas."

                />

            </>

        );

    }
    /* ======================================================
     * Renderização
     * ====================================================== */

    return (

        <>

            <PageHeader

                title="Resultados"

                subtitle="Publique os resultados oficiais das partidas."

                actions={headerActions}

            />

            <DataTable

                data={filteredMatches}

                columns={columns}

                loading={loading}

                getRowKey={(match) => match.id}

                onEdit={handleEdit}

            />

            <FormModal

                open={modalOpen}

                title="Publicar Resultado"

                onClose={handleClose}

                onSubmit={handleSave}

                loading={saving}

                submitText="Salvar Resultado"

            >

                <div className="results-form">

                    {/* =======================
                        Mandante
                    ======================== */}

                    <div className="result-team-card">

                        <img

                            src={
                                selectedMatch?.home_team.flag
                            }

                            alt={
                                selectedMatch?.home_team.name
                            }

                        />

                        <h3>

                            {
                                selectedMatch?.home_team.name
                            }

                        </h3>

                        <input

                            type="number"

                            min={0}

                            value={form.home_score}

                            onChange={(event)=>

                                updateField(

                                    "home_score",

                                    Number(
                                        event.target.value
                                    )

                                )

                            }

                        />

                    </div>

                    {/* =======================
                        Visitante
                    ======================== */}

                    <div className="result-team-card">

                        <img

                            src={
                                selectedMatch?.away_team.flag
                            }

                            alt={
                                selectedMatch?.away_team.name
                            }

                        />

                        <h3>

                            {
                                selectedMatch?.away_team.name
                            }

                        </h3>

                        <input

                            type="number"

                            min={0}

                            value={form.away_score}

                            onChange={(event)=>

                                updateField(

                                    "away_score",

                                    Number(
                                        event.target.value
                                    )

                                )

                            }

                        />

                    </div>

                    {/* =======================
                        Publicado
                    ======================== */}

                    <label className="results-checkbox">

                        <input

                            type="checkbox"

                            checked={form.finished}

                            onChange={(event)=>

                                updateField(

                                    "finished",

                                    event.target.checked

                                )

                            }

                        />

                        Resultado publicado

                    </label>

                </div>

            </FormModal>

        </>

    );

}