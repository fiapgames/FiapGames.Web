import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { authStore } from '../auth/authStore';
import { ApiError } from '../api/httpClient';
import { useAuth } from '../hooks/useAuth';
import { useUsersListQuery } from '../hooks/useUsers';

const PAGE_SIZE = 20;

export function UsersListPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error } = useUsersListQuery({ page, pageSize: PAGE_SIZE, search });

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  if (!isAuthenticated) {
    return (
      <section>
        <h1>Usuários</h1>
        <p>
          Você precisa <Link to="/login">entrar</Link> para ver a listagem de usuários.
        </p>
      </section>
    );
  }

  if (isError) {
    const apiError = error as ApiError;
    if (apiError.status === 401) authStore.clearSession();
    return (
      <section>
        <h1>Usuários</h1>
        <p className="error">
          {apiError.status === 401
            ? 'Sua sessão expirou. Entre novamente.'
            : `Erro ao carregar usuários: ${apiError.message}`}
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Usuários</h1>

      <form className="buyer-id" onSubmit={handleSearch}>
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por nome ou e-mail"
          aria-label="Buscar por nome ou e-mail"
        />
        <button type="submit">Buscar</button>
      </form>

      {isLoading ? (
        <p>Carregando usuários...</p>
      ) : (
        <>
          <table className="games-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((user) => (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {data?.items.length === 0 && <p>Nenhum usuário encontrado.</p>}

          {data && data.totalPages > 1 && (
            <div className="form-actions">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Anterior
              </button>
              <span>
                Página {data.page} de {data.totalPages}
              </span>
              <button type="button" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
