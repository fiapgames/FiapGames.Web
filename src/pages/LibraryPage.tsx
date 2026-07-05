import { Link, useParams } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import { useAuth } from '../hooks/useAuth';
import { useLibraryQuery } from '../hooks/useLibrary';

export function LibraryPage() {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const { session } = useAuth();
  const userId = paramUserId ?? session?.user.id;
  const { data: library, isLoading, isError, error } = useLibraryQuery(userId);

  if (!userId) {
    return (
      <p>
        Informe um ID de usuário no topo da página, ou <Link to="/login">entre com sua conta</Link> para ver sua
        própria biblioteca.
      </p>
    );
  }
  if (isLoading) return <p>Carregando biblioteca...</p>;

  if (isError) {
    const apiError = error as ApiError;
    const isUsersServiceDown = apiError.status === 503;
    return (
      <section>
        <h1>Biblioteca</h1>
        <p className="error">
          {isUsersServiceDown
            ? 'Serviço de usuários indisponível no momento (UsersAPI ainda não implementada). Tente novamente mais tarde.'
            : `Erro ao carregar biblioteca: ${apiError.message}`}
        </p>
      </section>
    );
  }

  if (!library) return null;

  return (
    <section>
      <h1>Biblioteca de {library.userName}</h1>
      <p>{library.userEmail}</p>

      {library.games.length === 0 ? (
        <p>Nenhum jogo comprado ainda.</p>
      ) : (
        <table className="games-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Gênero</th>
              <th>Comprado em</th>
              <th>Pedido</th>
            </tr>
          </thead>
          <tbody>
            {library.games.map((item) => (
              <tr key={item.gameId}>
                <td>{item.title}</td>
                <td>{item.genre}</td>
                <td>{new Date(item.purchasedAt).toLocaleString('pt-BR')}</td>
                <td>{item.orderId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
