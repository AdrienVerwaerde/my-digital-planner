
FROM node:20-alpine

WORKDIR /tests

COPY package*.json ./
RUN npm install

COPY . .

CMD ["sh", "./run-tests.sh"]
