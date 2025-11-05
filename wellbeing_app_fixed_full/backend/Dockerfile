FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src ./src
RUN chmod +x mvnw || true
RUN ./mvnw -q -DskipTests package
EXPOSE 8080
ENTRYPOINT ["java","-jar","target/wellbeing-backend-1.0.0.jar"]
