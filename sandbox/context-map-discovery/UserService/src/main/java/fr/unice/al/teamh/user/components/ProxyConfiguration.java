package fr.unice.al.teamh.user.components;

import fr.unice.al.teamh.user.Application;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.logging.Logger;

@Component
public class ProxyConfiguration implements CommandLineRunner {

    private static final Logger LOGGER = Logger.getLogger(ProxyConfiguration.class.getName());
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${proxy.url}")
    private String proxyUrl;

    @Value("${server.port}")
    private String port;

    @Override
    public void run(String... args) {
        LOGGER.info("Registering user-service to proxy");
        restTemplate.postForEntity(proxyUrl + "/api/restservices/" + Application.PROXY_ID + "/" + port, null, Void.class);
    }
}