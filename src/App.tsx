import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth/RequireAuth';
import { Layout } from './components/Layout';
import { GameFormPage } from './pages/GameFormPage';
import { GamesListPage } from './pages/GamesListPage';
import { LibraryPage } from './pages/LibraryPage';
import { LoginPage } from './pages/LoginPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { OrdersListPage } from './pages/OrdersListPage';
import { UserFormPage } from './pages/UserFormPage';
import { UsersListPage } from './pages/UsersListPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Entrar em "/" cai no catálogo; sem sessão, o RequireAuth abaixo desvia
            para /login. Ou seja: a primeira tela de quem não está logado é o login. */}
        <Route index element={<Navigate to="/games" replace />} />

        {/* Públicas — é o que dá para fazer sem token. O cadastro precisa ficar
            aberto porque é ele que cria a conta que depois gera o token (no Kong,
            POST /api/users também é rota pública). */}
        <Route path="login" element={<LoginPage />} />
        <Route path="users/new" element={<UserFormPage />} />

        {/* Protegidas — o Kong devolve 401 em todas estas sem Authorization. */}
        <Route element={<RequireAuth />}>
          <Route path="games" element={<GamesListPage />} />
          <Route path="games/new" element={<GameFormPage />} />
          <Route path="games/:id/edit" element={<GameFormPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderStatusPage />} />
          <Route path="users" element={<UsersListPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="library/:userId" element={<LibraryPage />} />
        </Route>

        {/* Path desconhecido volta para "/", que reaplica a regra acima. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
