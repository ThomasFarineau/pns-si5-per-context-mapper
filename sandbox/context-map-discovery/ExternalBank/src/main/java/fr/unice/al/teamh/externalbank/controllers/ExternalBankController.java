package fr.unice.al.teamh.externalbank.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/externalbank")
@Tag(name = "Cards")
public class ExternalBankController {
    @PostMapping("/processTransaction")
    public boolean processTransaction(@RequestBody String request) {
        System.out.println("Processing transaction: " + request);
        // Implémentez le traitement de la transaction ici
        // Retournez true si la transaction réussit, false sinon
        return true;  // ou false
    }
}
