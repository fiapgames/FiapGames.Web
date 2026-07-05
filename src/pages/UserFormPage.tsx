import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import type { UserDto } from '../api/types';
import { useCreateUser } from '../hooks/useUsers';

export function UserFormPage() {
  const createUser = useCreateUser();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [createdUser, setCreatedUser] = useState<UserDto | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    try {
      const user = await createUser.mutateAsync({ nome, email, password });
      setCreatedUser(user);
      setNome('');
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setFieldErrors(err.validationErrors ?? {});
      } else {
        setFormError('Falha ao cadastrar o usuário.');
      }
    }
  }

  if (createdUser) {
    return (
      <section>
        <h1>Usuário cadastrado</h1>
        <dl className="detail-list">
          <dt>ID</dt>
          <dd>{createdUser.id}</dd>
          <dt>Nome</dt>
          <dd>{createdUser.nome}</dd>
          <dt>E-mail</dt>
          <dd>{createdUser.email}</dd>
        </dl>
        <div className="form-actions">
          <Link to={`/library/${createdUser.id}`}>
            <button type="button">Ver biblioteca deste usuário</button>
          </Link>
          <button type="button" onClick={() => setCreatedUser(null)}>
            Cadastrar outro
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1>Cadastrar usuário</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={nome} onChange={(event) => setNome(event.target.value)} required />
          {fieldErrors.Nome?.map((message) => (
            <span key={message} className="error">
              {message}
            </span>
          ))}
        </label>

        <label>
          E-mail
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          {fieldErrors.Email?.map((message) => (
            <span key={message} className="error">
              {message}
            </span>
          ))}
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {fieldErrors.Password?.map((message) => (
            <span key={message} className="error">
              {message}
            </span>
          ))}
        </label>

        {formError && <p className="error">{formError}</p>}

        <div className="form-actions">
          <button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </section>
  );
}
