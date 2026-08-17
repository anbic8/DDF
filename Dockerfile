# --- Stage 1: build the React client ---
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# --- Stage 2: runtime ---
FROM node:20-alpine
WORKDIR /app

COPY server/package*.json ./server/
RUN npm install --omit=dev --prefix server

COPY server/ ./server/
COPY Serie.json ./Serie.json
COPY --from=client-build /app/client/dist ./client/dist

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server/index.js"]
