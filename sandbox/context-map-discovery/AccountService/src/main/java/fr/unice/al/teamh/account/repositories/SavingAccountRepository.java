package fr.unice.al.teamh.account.repositories;

import fr.unice.al.teamh.account.entities.SavingAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface SavingAccountRepository extends MongoRepository<SavingAccount, String> {
}
