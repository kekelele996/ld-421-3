# 实验室设备管理系统

## Docker 启动

```bash
FRONTEND_PORT=18801 BACKEND_PORT=19301 docker compose up --build
```

- 前端访问地址：http://localhost:18801
- 后端健康检查：http://localhost:19301/api/health
- 默认演示令牌：前端已内置 `x-demo-role: LabManager` 请求头；接口也支持 `Authorization: Bearer demo-admin-token`。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 18、TypeScript、Vite、Ant Design 5、ECharts、Zustand |
| 后端 | NestJS 风格分层、TypeScript、JWT、TypeORM 实体目录 |
| 数据库 | MySQL 8.0，Docker Compose 命名卷 |
| 部署 | Docker Compose、Nginx 静态前端、Node HTTP 后端 |

## 目录结构

```text
frontend/src/
  api/ stores/ types/ components/common/ hooks/ pages/ router/ utils/ constants/
backend/src/
  routes/ controllers/ services/ models/ middlewares/ types/ utils/ config/ database/
```

## 枚举位置

- 后端枚举：`backend/src/types/enums.ts`
- 前端枚举：`frontend/src/types/enums.ts`

## 主要接口

- `GET /api/dashboard`
- `GET|POST /api/equipment`
- `GET /api/categories`
- `GET|POST /api/borrow`
- `PATCH /api/borrow/:id/approve`
- `PATCH /api/borrow/:id/return`
- `GET|POST /api/reservations`
- `PATCH /api/reservations/:id/approve`
- `PATCH /api/reservations/:id/cancel`
- `GET|POST /api/maintenance`
- `GET /api/audit-logs`

## 本地验证

```bash
npm run check
npm --prefix backend start
curl http://127.0.0.1:3000/api/health
docker compose config
```

## License

MIT
