import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import { useLogin } from '../hooks/useUsers';

export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    try {
      await login.mutateAsync({ email, password });
      navigate('/users');
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Falha ao entrar.');
    }
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
    </section>
  );
}
