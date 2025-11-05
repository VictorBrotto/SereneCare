# Wellbeing App (Generated)
Projeto fullstack (frontend React + backend Spring Boot) para o formulário "Daily Log" mostrado no vídeo.

### O que foi implementado / melhorias aplicadas automaticamente
- Validação backend (painLevel entre 0 e 10, textos com tamanho máximo razoável).
- Tratamento de erros simples com respostas JSON padronizadas.
- CORS configurado para facilitar desenvolvimento local.
- Endpoint para salvar e listar logs por usuário (`/api/daily-logs` and `/api/daily-logs/user/{userId}`).
- Frontend React (Vite) com formulário (igual ao vídeo) e página de histórico que lista logs salvos.
- Dockerfile para backend e frontend + docker-compose para orquestração com PostgreSQL.
- CI básica (GitHub Actions) que executa `mvn -q -DskipTests package` para o backend build e `npm ci && npm run build` para o frontend build.
- Scripts e instruções para rodar localmente e com Docker Compose.

### Como baixar / usar
1. Extraia o zip e leia as instruções nos subdiretórios `backend/` e `frontend/`.
2. Para ambiente rápido local sem Docker, você pode rodar frontend com `npm install` e `npm run dev`, e backend com Maven (`./mvnw spring-boot:run`) apontando para um Postgres local.
3. Para Docker: `docker-compose up --build` na raiz do projeto.

