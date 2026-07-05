import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import { useAuth } from '../hooks/useAuth';
import { useDeactivateGame, useGamesQuery, usePurchaseGame } from '../hooks/useGames';

export function GamesListPage() {
  const { data: games, isLoading, isError, error } = useGamesQuery();
  const deactivateGame = useDeactivateGame();
  const purchaseGame = usePurchaseGame();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [buyerId, setBuyerId] = useState(session?.user.id ?? '');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Keep the field in sync with whoever is logged in, without fighting manual edits in between.
  useEffect(() => {
    setBuyerId(session?.user.id ?? '');
  }, [session?.user.id]);

  async function handlePurchase(gameId: string) {
    setPurchaseError(null);
    if (!buyerId.trim()) {
      setPurchaseError('Informe o ID do usuário comprador antes de comprar.');
      return;
    }

    try {
      const order = await purchaseGame.mutateAsync({ id: gameId, dto: { userId: buyerId.trim() } });
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setPurchaseError(err instanceof ApiError ? err.message : 'Falha ao iniciar a compra.');
    }
  }

  async function handleDeactivate(gameId: string) {
    if (!confirm('Inativar este jogo?')) return;
    await deactivateGame.mutateAsync(gameId);
  }

  if (isLoading) return <p>Carregando jogos...</p>;
  if (isError) return <p className="error">Erro ao carregar jogos: {(error as ApiError).message}</p>;

  return (
    <section>
      <h1>Jogos</h1>

      <div className="buyer-id">
        <label htmlFor="buyerId">ID do usuário comprador</label>
        <input
          id="buyerId"
          value={buyerId}
          onChange={(event) => setBuyerId(event.target.value)}
          placeholder="GUID do usuário"
        />
      </div>

      {purchaseError && <p className="error">{purchaseError}</p>}

      <table className="games-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Gênero</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {games?.map((game) => (
            <tr key={game.id}>
              <td>{game.title}</td>
              <td>{game.genre}</td>
              <td>{game.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>
                <span className={game.active ? 'badge badge--active' : 'badge badge--inactive'}>
                  {game.active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="games-table__actions">
                <Link to={`/games/${game.id}/edit`}>Editar</Link>
                {game.active && (
                  <>
                    <button onClick={() => handleDeactivate(game.id)} disabled={deactivateGame.isPending}>
                      Inativar
                    </button>
                    <button onClick={() => handlePurchase(game.id)} disabled={purchaseGame.isPending}>
                      Comprar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {games?.length === 0 && <p>Nenhum jogo cadastrado ainda.</p>}
    </section>
  );
}
