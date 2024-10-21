# Film-Streaming-MS

Film-Streaming-MS is a microservice-based backend for a movie streaming platform. It is designed to handle movie management, user watch history, and other services required for a streaming application. The project is built using Node.js with an emphasis on scalability and efficiency.

## Purpose

The main goals of this project are:

- **Movie Management**: Provides API endpoints to manage and retrieve movie data.
- **User Management**: Handles user authentication and authorization, as well as the storage of user watch history.
- **Scalability**: The microservice architecture allows the project to scale as the number of users and movie data increases.
- **Messaging Queue**: Uses RabbitMQ for communication between microservices, ensuring loose coupling and better performance.

## Key Technologies

- **Node.js**: Server-side JavaScript runtime used for building scalable network applications.
- **Express**: A minimal and flexible Node.js framework for building robust APIs.
- **MongoDB**: A NoSQL database for storing user and movie data.
- **RabbitMQ**: A message broker for communication between microservices.
- **Redis**: Used for caching frequently accessed data, improving performance.

## Features

- **User Authentication**: Secure authentication using JWT.
- **Movie Validation**: Verifies if a movie is valid through communication with the movie microservice.
- **Rate Limiting**: Prevents abuse by limiting the number of requests per IP using `express-rate-limit`.
- **Helmet**: Adds security headers to the API for better protection against web vulnerabilities.

## Installation

To set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/slached/Film-Streaming-MS.git
   ```

2. Navigate into the project directory:

   ```bash
   cd Film-Streaming-MS
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables by copying `.env.example` to `.env` and filling in the required values.

5. Start the services:

   ```bash
   npm start
   ```

## NPM Libraries Overview

### Security

- **Helmet**: Used for setting various HTTP headers to secure the Express app from well-known vulnerabilities.
- **express-rate-limit**: Limits repeated requests to APIs, protecting against brute-force attacks.
- **dotenv**: Manages environment variables, ensuring sensitive data remains secure.

### Performance Optimization

- **ioredis**: Manages caching with Redis, reducing database load by caching frequently requested data.
- **amqplib**: Integrates RabbitMQ for message-driven communication between microservices, reducing latency and ensuring asynchronous data processing.
- **mongoose**: A robust MongoDB object modeling tool that allows for schema-based data management.

## Current Status and Future Improvements

### Current State

- The application can verify and manage movies and user interactions with them.
- RabbitMQ is successfully handling communication between the services.
- Rate limiting and other basic security measures are in place.
- MongoDB is used for persistence of movie and user data.

### Future Enhancements

- **Improved Error Handling**: Ensuring better logging and error tracking.
- **Enhanced Caching**: Expanding the use of Redis for caching frequently accessed movie metadata.
- **Load Balancing**: Implementation of a load balancer for better distribution of incoming traffic.
- **Unit Testing**: Adding tests using tools like Jest to ensure the reliability of services.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
