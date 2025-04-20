FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src
COPY test/ ./test
COPY prisma/ ./prisma
COPY certs/ ./certs

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]