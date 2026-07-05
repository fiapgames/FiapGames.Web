# FiapGames.Web

Frontend em React + TypeScript (Vite) para o [FiapGames.Catalog](../FiapGames.Catalog) (CatalogAPI). Cobre todos os endpoints HTTP expostos pela API: jogos (CRUD + compra), pedidos e biblioteca do usuário.

## Stack

- React 19 + TypeScript + Vite
- React Router (navegação entre páginas)
- TanStack Query (cache, loading/error state e polling)
- CSS simples, sem lib de UI

## Estrutura

```
src/
  api/          cliente HTTP (fetch) e funções por recurso (games, orders, library, health)
  hooks/        hooks de React Query (useGamesQuery, useOrderQuery, ...)
  pages/        páginas roteadas (lista/form de jogos, pedido, biblioteca)
  components/   layout, navegação e indicador de saúde da API
```

## Rodando localmente

1. Suba o CatalogAPI (porta `8085` via `dotnet run`, ou `8080` via `docker compose up` no repositório do Catalog).
2. Instale as dependências e rode o dev server:

```bash
npm install
npm run dev
```

3. Acesse `http://localhost:5173`.

### CORS

O CatalogAPI não tem CORS configurado. Em desenvolvimento, o `vite.config.ts` já faz proxy de `/games`, `/orders`, `/library` e `/health` para `http://localhost:8085`, então as chamadas do browser são same-origin e o problema não aparece. Se a API rodar em outra porta, ajuste o proxy em `vite.config.ts`.

Em produção, defina `VITE_API_BASE_URL` (veja `.env.example`) apontando para a URL pública da API — nesse caso será necessário habilitar CORS no Catalog ou servir os dois atrás do mesmo domínio/reverse proxy.

### Observação sobre a biblioteca

`GET /library/{userId}` depende de uma UsersAPI que ainda não existe (ver README do Catalog). Enquanto isso, a página de biblioteca sempre retornará "serviço indisponível" após ~5s de timeout — isso já é tratado na UI.

## Scripts

- `npm run dev` — dev server com HMR
- `npm run build` — typecheck + build de produção
- `npm run preview` — serve o build de produção localmente
