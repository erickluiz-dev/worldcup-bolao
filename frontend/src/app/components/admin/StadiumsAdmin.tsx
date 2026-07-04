import { useEffect, useMemo, useState } from "react";

import type {
    Stadium,
    CreateStadiumRequest,
} from "../../types/Stadium";

import {
    getStadiums,
    createStadium,
    updateStadium,
    deleteStadium,
} from "../../services/stadiumService";

import PageHeader from "./PageHeader";
import DataTable, {
    DataTableColumn,
} from "./DataTable";
import EmptyState from "./EmptyState";
import FormModal from "./FormModal";
import ConfirmDialog from "./ConfirmDialog";

import "./StadiumsAdmin.css";


const emptyStadium: Stadium = {
    name: "",
    city: "",
    country: "",
    capacity: 0,
    image: "",
};

export default function StadiumsAdmin() {

    const [stadiums, setStadiums] =
        useState<Stadium[]>([]);

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

    const [selectedStadium, setSelectedStadium] =
        useState<Stadium>(emptyStadium);

    /* =====================================================
     * Carregar Estádios
     * ===================================================== */

    async function loadStadiums() {

        try {

            setLoading(true);

            const data =
                await getStadiums();

            setStadiums(data);

        } catch (error) {

            console.error(
                "Erro ao carregar estádios:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadStadiums();

    }, []);

    /* =====================================================
     * Pesquisa
     * ===================================================== */

    const filteredStadiums =
        useMemo(() => {

            if (!search.trim()) {
                return stadiums;
            }

            const value =
                search.toLowerCase();

            return stadiums.filter((stadium) =>

                stadium.name
                    .toLowerCase()
                    .includes(value)

                ||

                stadium.city
                    .toLowerCase()
                    .includes(value)

                ||

                stadium.country
                    .toLowerCase()
                    .includes(value)

            );

        }, [stadiums, search]);

    /* =====================================================
     * Ações
     * ===================================================== */

    function handleCreate() {

        setEditing(false);

        setSelectedStadium(
            emptyStadium
        );

        setModalOpen(true);

    }

    function handleEdit(
        stadium: Stadium
    ) {

        setEditing(true);

        setSelectedStadium(stadium);

        setModalOpen(true);

    }

    function handleDeleteClick(
        stadium: Stadium
    ) {

        setSelectedStadium(stadium);

        setDeleteOpen(true);

    }

    /* =====================================================
     * Colunas
     * ===================================================== */

    const columns:
        DataTableColumn<Stadium>[] = [

        {
            key: "name",

            title: "Estádio",
        },

        {
            key: "city",

            title: "Cidade",
        },

        {
            key: "country",

            title: "País",
        }

    ];

    return (

        <>

            <PageHeader

                title="Estádios"

                subtitle="Gerencie os estádios da Copa do Mundo."

                actions={

                    <button
                        className="primary-button"
                        onClick={
                            handleCreate
                        }
                    >
                        Novo Estádio
                    </button>

                }

            />

            <div className="admin-toolbar">

                <input
                    type="text"

                    placeholder="Pesquisar estádio..."

                    value={search}

                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />

            </div>

            {filteredStadiums.length === 0 &&
            !loading ? (

                <EmptyState

                    icon="🏟️"

                    title="Nenhum estádio cadastrado"

                    description="Cadastre o primeiro estádio da Copa."

                    action={

                        <button
                            className="primary-button"
                            onClick={
                                handleCreate
                            }
                        >
                            Novo Estádio
                        </button>

                    }

                />

            ) : (

                <DataTable

                    columns={columns}

                    data={filteredStadiums}

                    loading={loading}

                    getRowKey={(stadium) =>
                        stadium.id!
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
                        ? "Editar Estádio"
                        : "Novo Estádio"
                }
                submitText={
                    editing
                        ? "Salvar Alterações"
                        : "Cadastrar"
                }
                loading={loading}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedStadium(emptyStadium);
                }}
                onSubmit={handleSave}
            >
                <div className="form-grid">

                    <div className="form-group">
                        <label>Nome</label>

                        <input
                            type="text"
                            value={selectedStadium.name}
                            onChange={(e) =>
                                setSelectedStadium({
                                    ...selectedStadium,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Cidade</label>

                        <input
                            type="text"
                            value={selectedStadium.city}
                            onChange={(e) =>
                                setSelectedStadium({
                                    ...selectedStadium,
                                    city: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>País</label>

                        <input
                            type="text"
                            value={selectedStadium.country}
                            onChange={(e) =>
                                setSelectedStadium({
                                    ...selectedStadium,
                                    country: e.target.value,
                                })
                            }
                        />
                    </div>

                   


                </div>
            </FormModal>

            {/* =====================================================
             * Confirmar Exclusão
             * ===================================================== */}

            <ConfirmDialog
                open={deleteOpen}
                title="Excluir Estádio"
                message={`Deseja realmente excluir "${selectedStadium.name}"?`}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
                loading={loading}
                onCancel={() => {
                    setDeleteOpen(false);
                    setSelectedStadium(emptyStadium);
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
                !selectedStadium.name.trim() ||
                !selectedStadium.city.trim() ||
                !selectedStadium.country.trim() ||
                selectedStadium.capacity <= 0
            ) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            if (editing) {

                await updateStadium(selectedStadium);

            } else {

                await createStadium({
                    name: selectedStadium.name,
                    city: selectedStadium.city,
                    country: selectedStadium.country,
                    capacity: selectedStadium.capacity,
                    image: selectedStadium.image,
                });

            }

            setModalOpen(false);

            setSelectedStadium(emptyStadium);

            await loadStadiums();

        } catch (error) {

            console.error(
                "Erro ao salvar estádio:",
                error
            );

            alert("Não foi possível salvar o estádio.");

        } finally {

            setLoading(false);

        }

    }

    /* =====================================================
     * Excluir
     * ===================================================== */

    async function handleDelete() {

        if (!selectedStadium.id) return;

        try {

            setLoading(true);

            await deleteStadium(selectedStadium.id);

            setDeleteOpen(false);

            setSelectedStadium(emptyStadium);

            await loadStadiums();

        } catch (error) {

            console.error(
                "Erro ao excluir estádio:",
                error
            );

            alert("Não foi possível excluir o estádio.");

        } finally {

            setLoading(false);

        }

    }

}
