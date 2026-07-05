import { Navigate, Route, Routes } from 'react-router-dom';
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
        <Route index element={<Navigate to="/games" replace />} />
        <Route path="games" element={<GamesListPage />} />
        <Route path="games/new" element={<GameFormPage />} />
        <Route path="games/:id/edit" element={<GameFormPage />} />
        <Route path="orders" element={<OrdersListPage />} />
        <Route path="orders/:id" element={<OrderStatusPage />} />
        <Route path="users/new" element={<UserFormPage />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/:userId" element={<LibraryPage />} />
        <Route path="*" element={<Navigate to="/games" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
