# SQS Consumer

- Simple project to practice concepts of AWS SQS and local setup with Localstack

## Stack

- NestJS
- Typescript
- Prisma
- Postgres
- Docker / Compose
- Localstack
- Amazon SQS

## Run
1) docker compose up - Start localstack and postgres
2) yarn start - Start app

## Flow
- On initialization the app will create a queue
- Using Schedule/Con, every 5 seconds a new user will be added to queue
- In the main GET page (http://localhost:3000) the endpoint will consume the next user and return the html with the info
- When the next user in queue is consumed, a event will be emitted
- There are two listeners, one is responsible for saving the user in Postgres, using Prisma and the other one will remove the consumed user from queue
