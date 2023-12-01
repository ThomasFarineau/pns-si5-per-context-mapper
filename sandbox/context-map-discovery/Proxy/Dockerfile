# UserService Dockerfile
# Build under java 19 and spring
FROM openjdk:19-jdk-alpine

# Install maven
RUN apk update && apk add maven

# Set up the working directory
RUN mkdir -p /usr/src/proxy
WORKDIR /usr/src/proxy

# Copy the pom.xml and the rest of the files
COPY pom.xml /usr/src/proxy/
COPY . /usr/src/proxy/

# Use Maven to build the jar file
RUN mvn clean package

# Run the jar file
CMD ["java", "-jar", "target/proxy-0.0.1.jar"]