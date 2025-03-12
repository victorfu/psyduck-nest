FROM node:20-alpine AS builder
WORKDIR /app
RUN apk update
RUN npm install -g turbo
COPY . .
RUN npm ci
RUN turbo build --force

FROM node:20-alpine as runner
WORKDIR /app
COPY --from=builder /app/ .

EXPOSE 8080
CMD ["sh", "-c", "cd apps/api && node dist/main.js"]
