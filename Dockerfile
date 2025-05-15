FROM node:slim AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN yarn build --mode production

FROM nginx:1.28.0-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
