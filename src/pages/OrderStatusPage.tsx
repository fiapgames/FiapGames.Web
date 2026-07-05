import { useParams } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import { useOrderQuery } from '../hooks/useOrders';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'Pendente',
  Approved: 'Aprovado',
  Rejected: 'Rejeitado',
};

export function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, error } = useOrderQuery(id);

  if (isLoading) return <p>Carregando pedido...</p>;

  if (isError) {
    const apiError = error as ApiError;
    return (
      <section>
        <h1>Pedido</h1>
        <p className="error">
          {apiError.status === 404 ? 'Pedido não encontrado.' : `Erro ao carregar pedido: ${apiError.message}`}
        </p>
      </section>
    );
  }

  if (!order) return null;

  return (
    <section>
      <h1>Pedido</h1>
      <dl className="detail-list">
        <dt>ID do pedido</dt>
        <dd>{order.id}</dd>
        <dt>Jogo</dt>
        <dd>{order.gameId}</dd>
        <dt>Usuário</dt>
        <dd>{order.userId}</dd>
        <dt>Preço</dt>
        <dd>{order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</dd>
        <dt>Status</dt>
        <dd>
          <span className={`badge badge--status-${order.status.toLowerCase()}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
          {order.status === 'Pending' && ' (aguardando confirmação do pagamento...)'}
        </dd>
        <dt>Criado em</dt>
        <dd>{new Date(order.createdAt).toLocaleString('pt-BR')}</dd>
        <dt>Atualizado em</dt>
        <dd>{new Date(order.updatedAt).toLocaleString('pt-BR')}</dd>
      </dl>
    </section>
  );
}
