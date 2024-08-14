FROM node:19-alpine as build

# Note this dockerfile runs with the context of ".."

WORKDIR /app
COPY ./client/package*.json ./

RUN npm install -g @angular/cli
EXPOSE 4200

# DEVELOPMENT
FROM build as dev

RUN npm install

COPY ./client .
COPY ./shared ../shared
RUN ng build --configuration development

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]

# PRODUCTION
FROM build as prod


RUN npm install --frozen-lockfile

COPY ./client .
COPY ./shared ../shared
RUN ng build --configuration production


CMD ["ng", "serve", "--host", "0.0.0.0"]

# PRODUCTION
# CHANGE TO TESTS
FROM build as test

COPY ./client .
COPY ./shared ../shared


CMD ["whoami"]