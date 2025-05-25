FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache certbot openssl
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY init-letsencrypt.sh /usr/local/bin/init-letsencrypt.sh
RUN chmod +x /usr/local/bin/init-letsencrypt.sh
EXPOSE 80 443
CMD ["sh", "-c", "/usr/local/bin/init-letsencrypt.sh && nginx -g 'daemon off;'"]