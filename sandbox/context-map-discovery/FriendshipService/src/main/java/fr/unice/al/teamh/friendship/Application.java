package fr.unice.al.teamh.friendship;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static final String PROXY_ID = "friendship-service";

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
