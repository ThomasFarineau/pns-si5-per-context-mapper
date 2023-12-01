package fr.unice.al.teamh.transaction.repositories;

import fr.unice.al.teamh.transaction.entities.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    default List<Transaction> getPaginatedTransactions(String accountId, int pageSize, int offset) {
        return findAllBySenderOrReceiverOrderByCreatedAtDesc(accountId, accountId, pageSize, offset);
    }

    List<Transaction> findAllBySenderOrReceiverOrderByCreatedAtDesc(String accountId, String accountId1, int pageSize, int offset);
}
