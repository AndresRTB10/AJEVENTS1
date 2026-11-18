# Dockerfile del backend AJEVENTS (Spring Boot, Java 17).
# Colócalo en la carpeta backend/ del proyecto (junto a pom.xml).

# Etapa 1: compilar el .jar
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

# Etapa 2: imagen final, más liviana
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Limita la memoria de Java para que quepa en planes pequeños (512 MB)
ENV JAVA_TOOL_OPTIONS="-Xmx384m"

# El perfil prod usa el puerto 5000
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]
