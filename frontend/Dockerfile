FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Simple security headers
RUN printf 'add_header X-Frame-Options "DENY";\nadd_header X-Content-Type-Options "nosniff";\n' \
  > /etc/nginx/conf.d/security-headers.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

