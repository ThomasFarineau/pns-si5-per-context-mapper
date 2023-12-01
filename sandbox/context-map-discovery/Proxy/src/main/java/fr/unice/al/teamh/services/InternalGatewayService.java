package fr.unice.al.teamh.services;

import fr.unice.al.teamh.entities.RestService;
import fr.unice.al.teamh.repositories.RestServiceRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class InternalGatewayService {

    private final RestServiceRepository restServiceRepository;

    public InternalGatewayService(RestServiceRepository restServiceRepository) {
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

                HttpHeaders headers = new HttpHeaders();
                headers.add("Location", redirectUrl);
                return new ResponseEntity<>(headers, HttpStatus.FOUND);
            }
        }

        return ResponseEntity.notFound().build();
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