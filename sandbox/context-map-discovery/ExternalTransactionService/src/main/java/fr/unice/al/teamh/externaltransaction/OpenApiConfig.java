package fr.unice.al.teamh.externaltransaction;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("NewBank API - External Transaction Service")
                        .version("1.0")
                        .description("Service qui permet de gérer les transactions externes."));
    }
}