FROM node as modules
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node as builder
WORKDIR /app
COPY --from=modules /app/node_modules ./node_modules
COPY --from=modules /app/package.json ./package.json
COPY ./server ./server
COPY ./client ./client
RUN npm run build


FROM node:slim
USER node
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY ./public ./public

CMD [ "npm", "run", "start" ]
