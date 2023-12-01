package fr.unice.al.teamh.friendship.repositories;

import fr.unice.al.teamh.friendship.entities.Request;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface FriendRequestRepository extends MongoRepository<Request, String> {
    List<Request> findAllByReceiver(String id);

    List<Request> findAllBySender(String id);

    Request findBySenderAndReceiver(String receiver, String sender);
}
