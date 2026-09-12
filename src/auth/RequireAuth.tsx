import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Guarda as rotas que dependem de token. Existe porque o Kong passou a validar JWT
 * na borda: sem sessão, /games, /orders, /library e /api/users devolvem 401 e a tela
 * só teria erro para mostrar. Melhor mandar para o login.
 *
 * Guarda a origem em `state.from` para que o login devolva o usuário à página que
 * ele tentou abrir, em vez de sempre jogá-lo no catálogo.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
