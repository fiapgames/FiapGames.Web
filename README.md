# FiapGames.Web

Frontend em React + TypeScript (Vite) para o [FiapGames.Catalog](../FiapGames.Catalog) (CatalogAPI) e a [Fiap.Games.Users](../Fiap.Games.Users) (UsersAPI). Cobre jogos (CRUD + compra), pedidos, biblioteca do usuário e cadastro/login.

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

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Antes disso, o backend (Catalog + Users) precisa estar no ar em algum dos dois cenários abaixo — **e o `vite.config.ts` precisa apontar pro cenário certo**, senão as chamadas de API voltam `500`.

### CORS

Nenhum dos dois backends (Catalog, Users) tem CORS configurado. Em dev, o `vite.config.ts` faz proxy de `/games`, `/orders`, `/library`, `/health` (Catalog) e `/api` (Users) — assim o browser vê tudo como same-origin e o problema não aparece.

Em produção, defina `VITE_API_BASE_URL`/`VITE_USERS_API_BASE_URL` apontando para as URLs públicas das APIs — nesse caso será necessário habilitar CORS nos dois serviços ou servi-los atrás do mesmo domínio/reverse proxy.

### Cenário 1 — Docker Compose (`FiapGames.Orchestration`)

```bash
cd ../FiapGames.Orchestration
docker compose up -d --build
```

Os containers publicam as portas direto no host. `vite.config.ts` deve apontar para elas:

```ts
const apiProxy: ProxyOptions = {
  target: 'http://localhost:8080', // catalog-api
  ...
}
const usersApiProxy: ProxyOptions = {
  target: 'http://localhost:8083', // users-api
}
```

### Cenário 2 — Kubernetes (cluster Kind)

Depois de aplicar os manifests (veja o README do `FiapGames.Orchestration`), os serviços só existem dentro do cluster (`ClusterIP`) — pra acessar do host precisa de `kubectl port-forward` rodando (em terminais separados, ou em background):

```bash
kubectl port-forward -n fiapgames svc/catalog-api 8090:80
kubectl port-forward -n fiapgames svc/user-api 8091:80
```

Com o port-forward ativo, `vite.config.ts` deve apontar pras portas do forward:

```ts
const apiProxy: ProxyOptions = {
  target: 'http://localhost:8090', // catalog-api via port-forward
  ...
}
const usersApiProxy: ProxyOptions = {
  target: 'http://localhost:8091', // user-api via port-forward
}
```

### Depois de trocar o target

O Vite **não recarrega `vite.config.ts` a quente** — pare o dev server (`Ctrl+C`) e rode `npm run dev` de novo depois de editar os targets.

### Troubleshooting: erro 500 em qualquer chamada de API

Na maioria das vezes não é o backend que respondeu 500 — é o proxy do Vite retornando 500 porque não conseguiu conectar no `target` configurado (porta errada, port-forward caiu, ou container não está rodando). Confira, nessa ordem:

1. Qual cenário está de fato no ar: `docker ps` (Compose) ou `kubectl get pods -n fiapgames` (K8s).
2. Se os `target` do `vite.config.ts` batem com esse cenário.
3. Se for K8s, se os dois `kubectl port-forward` ainda estão vivos — eles caem se o terminal fechar ou o pod reiniciar, e precisam ser religados manualmente.

## Scripts

- `npm run dev` — dev server com HMR
- `npm run build` — typecheck + build de produção
- `npm run preview` — serve o build de produção localmente
