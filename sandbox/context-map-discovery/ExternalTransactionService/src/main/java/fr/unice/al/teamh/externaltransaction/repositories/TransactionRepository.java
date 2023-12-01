package fr.unice.al.teamh.externaltransaction.repositories;

import fr.unice.al.teamh.externaltransaction.entities.ExternalTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface TransactionRepository extends MongoRepository<ExternalTransaction, String> {
}
