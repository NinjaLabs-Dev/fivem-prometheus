FROM node:16

WORKDIR /usr/src/app

COPY .env ./
COPY package*.json ./

RUN npm install

RUN npm ci --omit=dev

COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
