FROM node:lts

RUN mkdir app
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

RUN npm run test

EXPOSE 3333

CMD ["npm", "start"]