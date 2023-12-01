package fr.unice.al.teamh.card.repositories;

import fr.unice.al.teamh.card.entities.Card;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByAccount(String accountId);
}
