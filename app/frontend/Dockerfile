FROM node:20-bookworm-slim AS dev

WORKDIR /express

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3000 

CMD ["npm","run","dev"]

FROM node:20-bookworm-slim AS prod

ENV NODE_ENV=production

WORKDIR /express

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm","run","prod"]
