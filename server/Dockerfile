FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
ENV NODE_ENV=production
EXPOSE 8080
CMD [ "node", "dist/src/index.js" ]
USER node