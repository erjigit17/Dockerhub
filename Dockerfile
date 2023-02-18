FROM node:18-alpine3.16 AS development

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:18-alpine3.16 AS production

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
COPY --from=development /usr/src/app/dist ./dist
USER node

EXPOSE ${PORT}

CMD ["node", "dist/main"]
