package fr.unice.al.teamh.user.repositories;

import fr.unice.al.teamh.user.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface UserRepository extends MongoRepository<User, String> {
}
