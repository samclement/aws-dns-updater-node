FROM node:8-alpine

WORKDIR /www

COPY ./index.js ./package.json ./package-lock.json /www/

RUN npm i --only=production

CMD ["npm", "start"]
