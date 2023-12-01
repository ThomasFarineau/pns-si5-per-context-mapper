package fr.unice.al.teamh.account;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info().title("NewBank API - Account Service").version("1.0").description("Service qui permet de gérer les comptes épargnes et courants des clients de NewBank"));
    }
}