FROM node:20.11-bookworm-slim
ENV TZ="Indian/Reunion"
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
COPY .env.local ./.env
COPY tsconfig.json ./
RUN npm install
COPY . ./
#RUN npm run build
ENTRYPOINT ["npm"]
CMD ["run","dev"]