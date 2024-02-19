FROM node:20-alpine AS builder
WORKDIR /app
RUN apk update
RUN npm install -g turbo
COPY . .
RUN npm ci

FROM node:20-alpine AS sourcer
WORKDIR /app
COPY --from=builder /app/ .
RUN npm install -g turbo
RUN turbo build --scope=api --scope=web --include-dependencies --no-deps

FROM node:20-alpine as runner
WORKDIR /app
COPY --from=sourcer /app/ .

CMD ["sh", "-c", "cd apps/api && node dist/main.js"]
