package fr.unice.al.teamh.card.controllers;

import fr.unice.al.teamh.card.components.dto.CardDtoIn;
import fr.unice.al.teamh.card.components.dto.CardDtoOut;
import fr.unice.al.teamh.card.mappers.CardMapper;
import fr.unice.al.teamh.card.services.CardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
@Tag(name = "Cards")
public class CardController {
    @Autowired
    private CardService cardService;
    @Autowired
    private CardMapper cardMapper;

    @PostMapping
    public void save(@RequestBody CardDtoIn card) {
        cardService.createCard(card);
    }

    @GetMapping
    public Iterable<CardDtoOut> get() {
        return cardService.findAll().stream().map(cardMapper::cardToCardDtoOut).toList();
    }

    @GetMapping("/account/{accountId}")
    public Iterable<CardDtoOut> getByAccountId(@PathVariable String accountId) {
        return cardService.findByAccountId(accountId).stream().map(cardMapper::cardToCardDtoOut).toList();
    }

    @GetMapping("/{id}")
    public CardDtoOut getById(@PathVariable String id) {
        try {
            return cardMapper.cardToCardDtoOut(cardService.findById(id));
        } catch (Exception e) {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable String id) {
        cardService.deleteById(id);
    }
}
