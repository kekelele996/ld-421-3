FROM node:26-alpine

WORKDIR /app
COPY package.json ./
COPY scripts ./scripts
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]
