import { useEffect, useMemo, useState } from "react";

import type { Team } from "../../types/Team";

import {
    getTeams,
} from "../../services/teamService";

import PageHeader from "./PageHeader";
import DataTable, {
    DataTableColumn,
} from "./DataTable";
import EmptyState from "./EmptyState";
import FormModal from "./FormModal";
import ConfirmDialog from "./ConfirmDialog";

import "./TeamsAdmin.css";

const emptyTeam: Team = {
    name: "",
    code: "",
    group: "",
    flag: "",
};

export default function TeamsAdmin() {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [editing, setEditing] =
        useState(false);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedTeam, setSelectedTeam] =
        useState<Team>(emptyTeam);

    /* =====================================================
     * Carregar seleções
     * ===================================================== */

    async function loadTeams() {

        try {

            setLoading(true);

            const data =
                await getTeams();

            setTeams(data);

        } catch (error) {

            console.error(
                "Erro ao carregar seleções:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadTeams();

    }, []);

    /* =====================================================
     * Pesquisa
     * ===================================================== */

    const filteredTeams =
        useMemo(() => {

            if (!search.trim()) {
                return teams;
            }

            const value =
                search.toLowerCase();

            return teams.filter((team) =>
                team.name
                    .toLowerCase()
                    .includes(value) ||

                team.code
                    .toLowerCase()
                    .includes(value) ||

                team.group
                    .toLowerCase()
                    .includes(value)
            );

        }, [teams, search]);

    /* =====================================================
     * Ações
     * ===================================================== */

    function handleCreate() {

        setEditing(false);

        setSelectedTeam(
            emptyTeam
        );

        setModalOpen(true);

    }

    function handleEdit(
        team: Team
    ) {

        setEditing(true);

        setSelectedTeam(team);

        setModalOpen(true);

    }

    function handleDeleteClick(
        team: Team
    ) {

        setSelectedTeam(team);

        setDeleteOpen(true);

    }

    /* =====================================================
     * Colunas
     * ===================================================== */

    const columns:
        DataTableColumn<Team>[] = [

        {
            key: "flag",

            title: "Bandeira",

            width: 90,

            align: "center",

            render: (value) => (

                <img
                    src={String(value)}
                    alt="Bandeira"
                    width={42}
                />

            ),

        },

        {
            key: "name",

            title: "Seleção",
        },

        {
            key: "code",

            title: "Código",

            align: "center",

            width: 120,
        },

        {
            key: "group",

            title: "Grupo",

            align: "center",

            width: 120,
        },

    ];

    return (

        <>

            <PageHeader

                title="Seleções"
                 
                subtitle="Gerencie as seleções participantes da Copa do Mundo."

                actions={

                    <button
                        className="primary-button"
                        onClick={
                            handleCreate
                        }
                    >
                        Nova Seleção
                    </button>

                }

            />

            <div
                className="admin-toolbar"
            >

                <input
                    type="text"

                    placeholder="Pesquisar seleção..."

                    value={search}

                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />

            </div>

            {filteredTeams.length === 0 &&
            !loading ? (

                <EmptyState

                    icon="🌍"

                    title="Nenhuma seleção encontrada"

                    description="Cadastre a primeira seleção da Copa."

                    action={

                        <button
                            className="primary-button"
                            onClick={
                                handleCreate
                            }
                        >
                            Nova Seleção
                        </button>

                    }

                />

            ) : (

                <DataTable

                    columns={columns}

                    data={filteredTeams}

                    loading={loading}

                    getRowKey={(team) =>
                        team.id!
                    }

                    onEdit={
                        handleEdit
                    }

                    onDelete={
                        handleDeleteClick
                    }

                />

            )}
            {/* =====================================================
             * Modal de Cadastro / Edição
             * ===================================================== */}

            <FormModal
                open={modalOpen}
                title={
                    editing
                        ? "Editar Seleção"
                        : "Nova Seleção"
                }
                submitText={
                    editing
                        ? "Salvar Alterações"
                        : "Cadastrar"
                }
                loading={loading}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedTeam(emptyTeam);
                }}
                onSubmit={handleSave}
            >
                <div className="form-grid">

                    <div className="form-group">

                        <label>Nome</label>

                        <input
                            type="text"
                            value={selectedTeam.name}
                            onChange={(e) =>
                                setSelectedTeam({
                                    ...selectedTeam,
                                    name: e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Código FIFA</label>

                        <input
                            type="text"
                            maxLength={3}
                            value={selectedTeam.code}
                            onChange={(e) =>
                                setSelectedTeam({
                                    ...selectedTeam,
                                    code: e.target.value.toUpperCase(),
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Grupo</label>

                        <input
                            type="text"
                            maxLength={1}
                            value={selectedTeam.group}
                            onChange={(e) =>
                                setSelectedTeam({
                                    ...selectedTeam,
                                    group: e.target.value.toUpperCase(),
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>URL da Bandeira</label>

                        <input
                            type="text"
                            value={selectedTeam.flag}
                            onChange={(e) =>
                                setSelectedTeam({
                                    ...selectedTeam,
                                    flag: e.target.value,
                                })
                            }
                        />

                    </div>

                </div>

            </FormModal>

            {/* =====================================================
             * Diálogo de Exclusão
             * ===================================================== */}

            <ConfirmDialog
                open={deleteOpen}
                title="Excluir Seleção"
                message={`Deseja realmente excluir "${selectedTeam.name}"?`}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
                loading={loading}
                onCancel={() => {
                    setDeleteOpen(false);
                    setSelectedTeam(emptyTeam);
                }}
                onConfirm={handleDelete}
            />

        </>

    );

    /* =====================================================
     * Salvar
     * ===================================================== */

    async function handleSave() {

        try {

            setLoading(true);

            if (
                !selectedTeam.name.trim() ||
                !selectedTeam.code.trim() ||
                !selectedTeam.group.trim()
            ) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            if (editing) {

                await updateTeam(selectedTeam);

            } else {

                await createTeam(selectedTeam);

            }

            setModalOpen(false);

            setSelectedTeam(emptyTeam);

            await loadTeams();

        } catch (error) {

            console.error(
                "Erro ao salvar seleção:",
                error
            );

            alert("Não foi possível salvar a seleção.");

        } finally {

            setLoading(false);

        }

    }

    /* =====================================================
     * Excluir
     * ===================================================== */

    async function handleDelete() {

        if (!selectedTeam.id) return;

        try {

            setLoading(true);

            await deleteTeam(selectedTeam.id);

            setDeleteOpen(false);

            setSelectedTeam(emptyTeam);

            await loadTeams();

        } catch (error) {

            console.error(
                "Erro ao excluir seleção:",
                error
            );

            alert("Não foi possível excluir a seleção.");

        } finally {

            setLoading(false);

        }

    }

}
