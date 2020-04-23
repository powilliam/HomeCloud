FROM node:lts

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

RUN mkdir __tests__/storage -p
RUN mkdir public/storage -p

RUN npm run test

EXPOSE 3333

CMD ["npm", "start"]