FROM node
WORKDIR .
COPY package.json .
RUN npm i
COPY . .
#WORKDIR /src
#RUN npm run build
## EXPOSE [Port you mentioned in the vite.config file]
EXPOSE 3300
#CMD ["npm", "serve"]
CMD ["npm", "run", "dev"]
