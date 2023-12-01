package fr.unice.al.teamh.services;

import fr.unice.al.teamh.entities.RestService;
import fr.unice.al.teamh.repositories.RestServiceRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URI;
import java.util.Enumeration;
import java.util.Optional;

@Service
@Slf4j
public class GatewayService {
    private static final int MAX_RETRIES = 1;

    private final RestServiceRepository restServiceRepository;

    public GatewayService(RestServiceRepository restServiceRepository) {
        this.restServiceRepository = restServiceRepository;
    }

    public ResponseEntity<?> forwardRequest(String id, HttpServletRequest request) {
        log.info("forwardRequest " + id);
        Optional<RestService> restService = restServiceRepository.findById(id);
        if (restService.isPresent()) {
            RestService service = restService.get();
            if (!service.getHosts().isEmpty()) {
                String host = selectHost(service);
                String redirectUrl = buildRedirectUrl(host, request, id);
                // Préparer la requête à transférer
                RequestEntity<?> requestToForward = prepareRequest(request, redirectUrl);
                log.info("requestToForward: " + requestToForward);
                if (requestToForward != null) {
                    return sendRequest(service, host, requestToForward, 0);
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<?> sendRequest(RestService service, String host, RequestEntity<?> requestToForward, int retries) {
        // Envoyer la requête via RestTemplate et obtenir la réponse
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(requestToForward, String.class);
        if (response.getStatusCode().is4xxClientError()) {
            log.error("Error 4xx: " + response.getStatusCode());
            // circuit breaker
            service.unavailableHost(host);
            if (retries < MAX_RETRIES)
                return sendRequest(service, selectHost(service), requestToForward, retries + 1);
        }
        return ResponseEntity.status(response.getStatusCode()).headers(response.getHeaders()).body(response.getBody());
    }

    private RequestEntity<?> prepareRequest(HttpServletRequest request, String redirectUrl) {
        try {
            // Capturer les headers de la requête originale
            HttpHeaders headers = extractHeaders(request);
            // Déterminer la méthode HTTP de la requête originale
            HttpMethod method = HttpMethod.valueOf(request.getMethod());

            // Pour les méthodes POST, PUT (ajoutez d'autres selon les besoins), inclure le corps de la requête
            if (method == HttpMethod.POST || method == HttpMethod.PUT) {
                // Assurez-vous de capturer le corps de la requête ici
                String body = extractBody(request);
                return new RequestEntity<>(body, headers, method, new URI(redirectUrl));
            } else {
                return new RequestEntity<>(headers, method, new URI(redirectUrl));
            }
        } catch (Exception e) {
            log.error("Error preparing request: " + e.getMessage());
            return null;
        }
    }

    private HttpHeaders extractHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.add(headerName, request.getHeader(headerName));
        }
        return headers;
    }

    private String extractBody(HttpServletRequest request) {
        // Exemple de méthode pour extraire le corps d'une requête
        // Notez que cela ne fonctionne que pour les requêtes avec un corps lisible une seule fois
        StringBuilder body = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            char[] buf = new char[1024];
            int bytesRead;
            while ((bytesRead = reader.read(buf)) != -1) {
                body.append(buf, 0, bytesRead);
            }
        } catch (IOException e) {
            log.error("Error reading request body: " + e.getMessage());
        }
        return body.toString();
    }

    private String selectHost(RestService service) {
        log.info("selectHost " + service.getHosts());
        return service.nextHost().orElseThrow(() -> new RuntimeException("No host available for service " + service.getId()));
    }

    private String buildRedirectUrl(String host, HttpServletRequest request, String id) {
        log.info("buildRedirectUrl " + host);
        StringBuilder redirectUrl = new StringBuilder(host);

        // Ajoutez le chemin et les paramètres de la requête
        String pathAfterId = request.getRequestURI().substring(request.getRequestURI().indexOf(id) + id.length());
        redirectUrl.append(pathAfterId);

        String query = request.getQueryString();
        if (query != null && !query.isEmpty()) {
            redirectUrl.append("?").append(query);
        }

        return redirectUrl.toString();
    }
}
