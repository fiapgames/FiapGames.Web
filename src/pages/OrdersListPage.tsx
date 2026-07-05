import { Link } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import { useOrdersQuery } from '../hooks/useOrders';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'Pendente',
  Approved: 'Aprovado',
  Rejected: 'Rejeitado',
};

export function OrdersListPage() {
  const { data: orders, isLoading, isError, error } = useOrdersQuery();

  if (isLoading) return <p>Carregando pedidos...</p>;
  if (isError) return <p className="error">Erro ao carregar pedidos: {(error as ApiError).message}</p>;

  return (
    <section>
      <h1>Pedidos</h1>

      <table className="games-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Jogo</th>
            <th>Usuário</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Motivo da rejeição</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>
                <Link to={`/orders/${order.id}`}>{order.id}</Link>
              </td>
              <td>{order.gameId}</td>
              <td>{order.userId}</td>
              <td>{order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>
                <span className={`badge badge--status-${order.status.toLowerCase()}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </td>
              <td>{order.status === 'Rejected' ? order.rejectionReason : '—'}</td>
              <td>{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders?.length === 0 && <p>Nenhum pedido registrado ainda.</p>}
    </section>
  );
}
