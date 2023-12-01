package fr.unice.al.teamh.account;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static final String PROXY_ID = "account-service";

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
