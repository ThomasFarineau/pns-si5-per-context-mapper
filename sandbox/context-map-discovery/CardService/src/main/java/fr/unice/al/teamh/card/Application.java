package fr.unice.al.teamh.card;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static final String PROXY_ID = "card-service";

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
