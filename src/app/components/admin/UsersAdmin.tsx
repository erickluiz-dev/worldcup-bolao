import { useEffect, useMemo, useState } from "react";

import PageHeader from "./PageHeader";
import DataTable, {
    DataTableColumn,
} from "./DataTable";
import EmptyState from "./EmptyState";
import FormModal from "./FormModal";
import ConfirmDialog from "./ConfirmDialog";

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../../services/userService";

import type {
    User,
    CreateUserRequest,
} from "../../types/User";

import "./UsersAdmin.css";

export default function UsersAdmin() {

    /* ======================================================
     * Estados
     * ====================================================== */

    const [users, setUsers] =
        useState<User[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [modalOpen, setModalOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    /* ======================================================
     * Carregar usuários
     * ====================================================== */

    async function loadUsers() {

        try {

            setLoading(true);

            const data =
                await getUsers();

            setUsers(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadUsers();

    }, []);

    /* ======================================================
     * Pesquisa
     * ====================================================== */

    const filteredUsers =
        useMemo(() => {

            if (!search.trim()) {

                return users;

            }

            const query =
                search.toLowerCase();

            return users.filter(user =>

                user.name
                    .toLowerCase()
                    .includes(query)

                ||

                user.email
                    .toLowerCase()
                    .includes(query)

                ||

                user.role
                    .toLowerCase()
                    .includes(query)

            );

        }, [

            users,

            search,

        ]);

    /* ======================================================
     * Formulário
     * ====================================================== */

    const emptyUser: CreateUserRequest = {

        name: "",

        email: "",

        password: "",

        avatar: 1,

    };

    const [form, setForm] =
        useState<CreateUserRequest>(
            emptyUser
        );

    const editing =
        selectedUser !== null;

    /* ======================================================
     * Colunas
     * ====================================================== */

    const columns:
        DataTableColumn<User>[] = [

        {

            key: "avatar",

            title: "",

            width: 70,

            align: "center",

            render: (_, row) => (

                <img
                    src={`/avatars/avatar${row.avatar}.png`}
                    alt={row.name}
                    className="user-avatar"
                />

            ),

        },

        {

            key: "name",

            title: "Nome",

        },

        {

            key: "email",

            title: "E-mail",

        },

        {

            key: "role",

            title: "Perfil",

            align: "center",

            render: (_, row) => (

                <span
                    className={`user-role ${row.role}`}
                >

                    {row.role}

                </span>

            ),

        },

        {

            key: "active",

            title: "Status",

            align: "center",

            render: (_, row) => (

                row.active

                    ? (

                        <span className="user-active">

                            Ativo

                        </span>

                    )

                    : (

                        <span className="user-inactive">

                            Inativo

                        </span>

                    )

            ),

        },

        {

            key: "created_at",

            title: "Cadastro",

            render: (_, row) =>

                new Date(
                    row.created_at
                ).toLocaleDateString(
                    "pt-BR"
                ),

        },

    ];
    /* ======================================================
     * Novo Usuário
     * ====================================================== */

    function handleNew() {

        setSelectedUser(null);

        setForm(emptyUser);

        setModalOpen(true);

    }

    /* ======================================================
     * Editar Usuário
     * ====================================================== */

    function handleEdit(
        user: User
    ) {

        setSelectedUser(user);

        setForm({

            name: user.name,

            email: user.email,

            password: "",

            avatar: user.avatar,

            role: user.role,

            active: user.active,

        });

        setModalOpen(true);

    }

    /* ======================================================
     * Fechar Modal
     * ====================================================== */

    function handleCloseModal() {

        if (saving) return;

        setModalOpen(false);

        setSelectedUser(null);

        setForm(emptyUser);

    }

    /* ======================================================
     * Atualizar Campo
     * ====================================================== */

    function updateField<
        K extends keyof CreateUserRequest
    >(
        field: K,
        value: CreateUserRequest[K]
    ) {

        setForm(previous => ({

            ...previous,

            [field]: value,

        }));

    }

    /* ======================================================
     * Salvar Usuário
     * ====================================================== */

    async function handleSave() {

        try {

            setSaving(true);

            if (!form.name.trim()) {

                alert("Informe o nome.");

                return;

            }

            if (!form.email.trim()) {

                alert("Informe o e-mail.");

                return;

            }

            if (!editing && !form.password.trim()) {

                alert("Informe a senha.");

                return;

            }

            if (editing && selectedUser) {

                const updated =
                    await updateUser({

                        ...selectedUser,

                        ...form,

                    });

                setUsers(previous =>

                    previous.map(user =>

                        user.id === updated.id

                            ? updated

                            : user

                    )

                );

            }

            else {

                const created =
                    await createUser(form);

                setUsers(previous => [

                    ...previous,

                    created,

                ]);

            }

            handleCloseModal();

        }

        catch (error) {

            console.error(error);

            alert(

                error instanceof Error

                    ? error.message

                    : "Erro ao salvar usuário."

            );

        }

        finally {

            setSaving(false);

        }

    }

    /* ======================================================
     * Exclusão
     * ====================================================== */

    function handleDeleteClick(
        user: User
    ) {

        setSelectedUser(user);

        setDeleteOpen(true);

    }

    async function handleDelete() {

        if (!selectedUser) {

            return;

        }

        try {

            setSaving(true);

            await deleteUser(
                selectedUser.id
            );

            setUsers(previous =>

                previous.filter(user =>

                    user.id !== selectedUser.id

                )

            );

            setDeleteOpen(false);

            setSelectedUser(null);

        }

        catch (error) {

            console.error(error);

            alert(

                error instanceof Error

                    ? error.message

                    : "Erro ao excluir usuário."

            );

        }

        finally {

            setSaving(false);

        }

    }

    function handleCancelDelete() {

        setDeleteOpen(false);

        setSelectedUser(null);

    }

    /* ======================================================
     * Header
     * ====================================================== */

    const headerActions = (

        <button

            className="admin-primary-button"

            onClick={handleNew}

        >

            + Novo Usuário

        </button>

    );

    /* ======================================================
     * Empty State
     * ====================================================== */

    if (

        !loading &&

        filteredUsers.length === 0

    ) {

        return (

            <>

                <PageHeader

                    title="Usuários"

                    subtitle="Gerencie usuários do sistema."

                    actions={headerActions}

                />

                <EmptyState

                    icon="👥"

                    title="Nenhum usuário encontrado"

                    description="Cadastre o primeiro usuário."

                    action={

                        <button

                            className="admin-primary-button"

                            onClick={handleNew}

                        >

                            Novo Usuário

                        </button>

                    }

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

                title="Usuários"

                subtitle="Gerencie os usuários cadastrados no sistema."

                actions={headerActions}

            />

            {/* Pesquisa */}

            <div className="users-toolbar">

                <input

                    type="text"

                    className="users-search"

                    placeholder="Pesquisar por nome, e-mail ou perfil..."

                    value={search}

                    onChange={(event) =>

                        setSearch(
                            event.target.value
                        )

                    }

                />

            </div>

            {/* Tabela */}

            <DataTable

                data={filteredUsers}

                columns={columns}

                loading={loading}

                getRowKey={(user) => user.id}

                onEdit={handleEdit}

                onDelete={handleDeleteClick}

            />

            {/* Modal */}

            <FormModal

                open={modalOpen}

                title={
                    editing
                        ? "Editar Usuário"
                        : "Novo Usuário"
                }

                onClose={handleCloseModal}

                onSubmit={handleSave}

                loading={saving}

                submitText={
                    editing
                        ? "Salvar Alterações"
                        : "Cadastrar Usuário"
                }

            >

                <div className="user-form">

                    {/* Nome */}

                    <div className="form-group">

                        <label>Nome</label>

                        <input

                            type="text"

                            value={form.name}

                            onChange={(event)=>

                                updateField(

                                    "name",

                                    event.target.value

                                )

                            }

                        />

                    </div>

                    {/* Email */}

                    <div className="form-group">

                        <label>E-mail</label>

                        <input

                            type="email"

                            value={form.email}

                            onChange={(event)=>

                                updateField(

                                    "email",

                                    event.target.value

                                )

                            }

                        />

                    </div>

                    {/* Senha */}

                    <div className="form-group">

                        <label>

                            Senha

                        </label>

                        <input

                            type="password"

                            value={form.password}

                            placeholder={
                                editing
                                    ? "Deixe em branco para manter"
                                    : ""
                            }

                            onChange={(event)=>

                                updateField(

                                    "password",

                                    event.target.value

                                )

                            }

                        />

                    </div>

                    {/* Avatar */}

                    <div className="form-group">

                        <label>

                            Avatar

                        </label>

                        <select

                            value={form.avatar}

                            onChange={(event)=>

                                updateField(

                                    "avatar",

                                    Number(
                                        event.target.value
                                    )

                                )

                            }

                        >

                            {Array.from(
                                { length: 21 },
                                (_, index) => (

                                    <option

                                        key={index + 1}

                                        value={index + 1}

                                    >

                                        Avatar {index + 1}

                                    </option>

                                )

                            )}

                        </select>

                    </div>

                    {/* Perfil */}

                    <div className="form-group">

                        <label>

                            Perfil

                        </label>

                        <select

                            value={
                                form.role ?? "user"
                            }

                            onChange={(event)=>

                                updateField(

                                    "role",

                                    event.target.value as
                                        "admin" | "user"

                                )

                            }

                        >

                            <option value="user">

                                Usuário

                            </option>

                            <option value="admin">

                                Administrador

                            </option>

                        </select>

                    </div>

                    {/* Status */}

                    <div className="form-checkbox">

                        <label>

                            <input

                                type="checkbox"

                                checked={
                                    form.active ?? true
                                }

                                onChange={(event)=>

                                    updateField(

                                        "active",

                                        event.target.checked

                                    )

                                }

                            />

                            Usuário ativo

                        </label>

                    </div>

                </div>

            </FormModal>

            {/* Exclusão */}

            <ConfirmDialog

                open={deleteOpen}

                title="Excluir Usuário"

                message={
                    selectedUser

                        ? `Deseja realmente excluir ${selectedUser.name}?`

                        : ""

                }

                confirmText="Excluir"

                cancelText="Cancelar"

                variant="danger"

                loading={saving}

                onCancel={handleCancelDelete}

                onConfirm={handleDelete}

            />

        </>

    );

}