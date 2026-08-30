import { type FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import { useAuth } from '../hooks/useAuth';
import { useLogin } from '../hooks/useUsers';

export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Para onde voltar depois de entrar: a página que o RequireAuth interrompeu, ou o
  // catálogo quando o usuário abriu /login por conta própria.
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/games';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    try {
      await login.mutateAsync({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Falha ao entrar.');
    }
  }

  // Quem já tem sessão não deve ficar vendo a tela de login (ao voltar no histórico,
  // ou ao abrir /login direto).
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <section>
      <h1>Entrar</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {formError && <p className="error">{formError}</p>}

        <div className="form-actions">
          <button type="submit" disabled={login.isPending}>
            {login.isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>

      <p>
        Não tem conta? <Link to="/users/new">Cadastre-se</Link>
      </p>
    </section>
  );
}
