FROM node:23

WORKDIR /home

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]