import { type FormEvent, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authStore } from '../auth/authStore';
import { useAuth } from '../hooks/useAuth';
import { HealthBadge } from './HealthBadge';

export function Layout() {
  const navigate = useNavigate();
  const { session, isAuthenticated } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [userId, setUserId] = useState(session?.user.id ?? '');

  // Keep the field in sync with whoever is logged in, without fighting manual edits in between.
  useEffect(() => {
    setUserId(session?.user.id ?? '');
  }, [session?.user.id]);

  function handleLogout() {
    authStore.clearSession();
    navigate('/login');
  }

  function goToOrder(event: FormEvent) {
    event.preventDefault();
    if (orderId.trim()) navigate(`/orders/${orderId.trim()}`);
  }

  function goToLibrary(event: FormEvent) {
    event.preventDefault();
    if (userId.trim()) navigate(`/library/${userId.trim()}`);
  }

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__brand">FiapGames Catalog</div>

        <nav className="layout__nav">
          <NavLink to="/games" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Jogos
          </NavLink>
          <NavLink to="/games/new" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Novo jogo
          </NavLink>
          <NavLink to="/users/new" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            1. Cadastrar usuário
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            2. Biblioteca
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Listar usuários
          </NavLink>
        </nav>

        <form className="layout__lookup" onSubmit={goToOrder}>
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="ID do pedido"
            aria-label="ID do pedido"
          />
          <button type="submit">Ver pedido</button>
        </form>

        <form className="layout__lookup" onSubmit={goToLibrary}>
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="ID do usuário"
            aria-label="ID do usuário"
          />
          <button type="submit">Ver biblioteca</button>
        </form>

        <div className="layout__auth">
          {isAuthenticated ? (
            <>
              <span>{session?.user.nome}</span>
              <button type="button" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Entrar
            </NavLink>
          )}
        </div>

        <HealthBadge />
      </header>

      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}
