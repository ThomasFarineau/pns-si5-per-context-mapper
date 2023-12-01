package fr.unice.al.teamh.controllers;

import fr.unice.al.teamh.components.dto.ServiceDtoIn;
import fr.unice.al.teamh.entities.RestService;
import fr.unice.al.teamh.services.RestServiceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restservices")
@Tag(name = "Rest Services Management")
public class RestServiceController {
    private final RestServiceService restServiceService;

    public RestServiceController(RestServiceService restServiceService) {
        this.restServiceService = restServiceService;
    }

    @PostMapping("/{id}/{port}")
    public void add(@PathVariable String id, @PathVariable String port, HttpServletRequest request) {
        String hostAddress = request.getRemoteAddr();
        String protocol = request.isSecure() ? "https://" : "http://";
        String fullHost = protocol + hostAddress + ":" + port;
        ServiceDtoIn serviceDtoIn = new ServiceDtoIn();
        serviceDtoIn.setId(id);
        serviceDtoIn.setHost(fullHost);
        restServiceService.add(serviceDtoIn);
    }

    @GetMapping()
    public List<RestService> getAll() {
        return restServiceService.getAll();
    }
}
