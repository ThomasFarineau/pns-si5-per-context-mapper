package fr.unice.al.teamh.externaltransaction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static final String PROXY_ID = "external-transaction-service";

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
