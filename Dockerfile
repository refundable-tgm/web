FROM node:lts-alpine AS vue-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production
COPY --from=vue-builder /app/dist /usr/share/nginx/html
COPY history.conf /etc/nginx/conf.d/history.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
