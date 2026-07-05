import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../api/httpClient';
import { useCreateGame, useGameQuery, useUpdateGame } from '../hooks/useGames';

export function GameFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: existingGame, isLoading } = useGameQuery(id);
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [genre, setGenre] = useState('');
  const [active, setActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!existingGame) return;
    setTitle(existingGame.title);
    setDescription(existingGame.description);
    setPrice(String(existingGame.price));
    setGenre(existingGame.genre);
    setActive(existingGame.active);
  }, [existingGame]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const dto = { title, description, price: Number(price), genre };

    try {
      if (isEditing && id) {
        await updateGame.mutateAsync({ id, dto: { ...dto, active } });
      } else {
        await createGame.mutateAsync(dto);
      }
      navigate('/games');
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setFieldErrors(err.validationErrors ?? {});
      } else {
        setFormError('Falha ao salvar o jogo.');
      }
    }
  }

  if (isEditing && isLoading) return <p>Carregando jogo...</p>;

  const isSaving = createGame.isPending || updateGame.isPending;

  return (
    <section>
      <h1>{isEditing ? 'Editar jogo' : 'Novo jogo'}</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          {fieldErrors.Title?.map((message) => (
            <span key={message} className="error">
              {message}
            </span>
          ))}
        </label>

        <label>
          Descrição
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} required />
          {fieldErrors.Description?.map((message) => (
            <span key={message} className="error">
              {message}
            </span>
          ))}
        </label>

        <label>
          Gênero
          <input value={genre} onChange={(event) => setGenre(event.target.value)} required />
          {fieldErrors.Genre?.map((message) => (
            <span key={message} className="error">
              {message}
            </span>
          ))}
        </label>

        <label>
          Preço
          <input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required />
          {fieldErrors.Price?.map((message) => (
            <span key={message} className="error">
              {message}
            </span>
          ))}
        </label>

        {isEditing && (
          <label className="checkbox-field">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
            Ativo
          </label>
        )}

        {formError && <p className="error">{formError}</p>}

        <div className="form-actions">
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={() => navigate('/games')}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
