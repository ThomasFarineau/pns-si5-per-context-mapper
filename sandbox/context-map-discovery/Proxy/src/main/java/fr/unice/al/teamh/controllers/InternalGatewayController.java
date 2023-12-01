package fr.unice.al.teamh.controllers;

import fr.unice.al.teamh.services.InternalGatewayService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Internal Gateway Accessor")
@RequestMapping("/gi/{id}")
public class InternalGatewayController {

    private final InternalGatewayService internalGatewayService;

    public InternalGatewayController(InternalGatewayService internalGatewayService) {
        this.internalGatewayService = internalGatewayService;
    }

    @RequestMapping(value = "/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<?> redirectRequest(@PathVariable String id, HttpServletRequest request) {
        return internalGatewayService.forwardRequest(id, request);
    }
}
