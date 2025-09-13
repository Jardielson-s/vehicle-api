# Description
<p>This application is a vehicle manager</p>

## Tools

* nestjs
* node v22
* mongodb
* terraform
* localstack
* aws

## Arch
<p> 
  <strong> Layer Architecture </strong>
  <br/>
The primary goal of this pattern is to separate concerns, making your codebase more organized, testable, and easier to manage as it grows. Here's a breakdown of why each layer is important:

  * Model: This layer represents your data structures. It defines the schema and business objects used throughout the application. By centralizing models, you ensure data consistency and provide a clear blueprint for what your application manipulates.

  *Repository: This layer is responsible for data persistence. It contains the logic for interacting with your database, external APIs, or any other data source. By abstracting this logic behind an interface, you can easily swap out your database (e.g., from SQL to a NoSQL database) without affecting the other layers

  * Service: This is the core of your business logic. The service layer orchestrates interactions between the repository and the handler. It performs tasks like data validation, business calculations, and calling multiple repositories to fulfill a request. It should not know about the HTTP details, making it highly reusable and easy to test.

  * Controllers: Also known as the handler, this layer is the entry point for incoming requests. It handles HTTP-specific tasks like parsing requests, validating input data, and formatting responses. It calls the service layer to perform the business logic and then sends the response back to the client.

Key Benefits of this Architecture

  * Testability: Since each layer has a single responsibility, it becomes much easier to write unit tests. You can test your service layer by providing mock repositories, without needing a real database connection. This leads to faster and more reliable tests.

  * Maintainability: When you need to fix a bug or add a new feature, you know exactly where to go. A bug in data saving? Look at the repository. A change in business rules? The service layer is your target.

  * Scalability: The clear separation of responsibilities allows different teams to work on different layers simultaneously without stepping on each other's toes. This is crucial for larger projects.

  * Flexibility: The use of interfaces for the repository and service layers makes your code very flexible. You can create different implementations for different environments (e.g., a mock repository for local development and a real one for production).

Potential Downsides
While this architecture is excellent, it's important to be aware of potential issues, especially for smaller projects:

  * Initial Overhead: For a very simple application, this pattern can feel like overkill. It requires more files and interfaces, which might seem unnecessary at first.

  * Increased Complexity: As with any pattern, if not implemented correctly, it can lead to over-engineering. It's vital to keep the layers focused on their specific roles and avoid mixing responsibilities.

</p>

## Arch  Diagram
![arch](https://github.com/Jardielson-s/vehicle-api/blob/main/imgs/arch.png)

## Run application

### Install dependencies
```bash
yarn install
```

### Set env
```bash
# replace env.example to .env or create .env with the env that are in env.example
.env.example
```

### Run mongo and localstack
```bash
docker compose up mongo localstack -d

```

### Run scripts
```bash
# first
chmod +x scripts/create-queue.sh
# after
./scripts/create-queue.sh
```

### Run application without docker compose
```bash
# development
yarn start:dev

# prod
yarn build
yarn start
```

### Access swagger
```
http://localhost:${PORT}/docs
```

## Run appication with docker compose
```bash
docker compose up api -d
# or run in iterative mode
# docker compose up api 
```
