# UserService Dockerfile
# Build under java 19 and spring
FROM openjdk:19-jdk-alpine

# Install maven
RUN apk update && apk add maven

# Set up the working directory
RUN mkdir -p /usr/src/account-service
WORKDIR /usr/src/account-service

# Copy the pom.xml and the rest of the files
COPY pom.xml /usr/src/account-service/
COPY . /usr/src/account-service/

# Use Maven to build the jar file
RUN mvn clean package

# Set default environment variables (can be overridden by Docker Compose)
ENV SERVICE_USER_URL=http://localhost:3000/api/
ENV SERVICE_TRANSACTION_URL=http://localhost:3002/api/
ENV DATABASE_URL=mongodb://localhost:27017/app

# Run the jar file
CMD ["java", "-jar", "target/account-service-0.0.1.jar"]