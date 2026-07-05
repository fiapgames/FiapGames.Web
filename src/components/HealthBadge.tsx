import { useHealthQuery } from '../hooks/useHealth';

export function HealthBadge() {
  const { data, isError, isLoading } = useHealthQuery();

  const status = isLoading ? 'checking' : isError ? 'down' : data === 'Healthy' ? 'up' : 'unknown';

  const label = {
    checking: 'Verificando API...',
    up: 'API online',
    down: 'API indisponível',
    unknown: 'Status desconhecido',
  }[status];

  return (
    <span className={`health-badge health-badge--${status}`} title={label}>
      <span className="health-badge__dot" />
      {label}
    </span>
  );
}
