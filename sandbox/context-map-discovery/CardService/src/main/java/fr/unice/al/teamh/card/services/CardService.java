package fr.unice.al.teamh.card.services;

import fr.unice.al.teamh.card.components.dto.AccountDto;
import fr.unice.al.teamh.card.components.dto.CardDtoIn;
import fr.unice.al.teamh.card.entities.Card;
import fr.unice.al.teamh.card.exceptions.AccountNotFoundException;
import fr.unice.al.teamh.card.exceptions.CardNotFoundException;
import fr.unice.al.teamh.card.repositories.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class CardService {
    @Autowired
    private CardRepository cardRepository;

    @Value("${proxy.url}")
    private String proxyUrl;

    public Card createCard(CardDtoIn card) {
        RestTemplate restTemplate = new RestTemplate();
        AccountDto account = restTemplate.getForObject(proxyUrl + "g/account-service/api/accounts/" + card.getAccountId(), AccountDto.class);
        if (account == null) throw new AccountNotFoundException(card.getAccountId());
        Card newCard = new Card();
        newCard.setSpendingLimit(card.getSpendingLimit());
        newCard.setAccount(account.getId());
        newCard.generate();
        return cardRepository.save(newCard);
    }

    public List<Card> findAll() {
        return cardRepository.findAll();
    }

    public List<Card> findByAccountId(String accountId) {
        return cardRepository.findByAccount(accountId);
    }

    public Card findById(String id) {
        return cardRepository.findById(id).orElseThrow(() -> new CardNotFoundException(id));
    }

    public void deleteById(String id) {
        cardRepository.deleteById(id);
    }
}
