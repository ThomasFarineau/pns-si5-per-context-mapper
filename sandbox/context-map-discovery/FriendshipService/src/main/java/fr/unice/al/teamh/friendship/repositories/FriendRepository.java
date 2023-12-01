package fr.unice.al.teamh.friendship.repositories;

import fr.unice.al.teamh.friendship.entities.Friendship;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface FriendRepository extends MongoRepository<Friendship, String> {
    default Friendship findByUsers(String userId1, String userId2) {
        return findAll().stream().filter(friendship -> friendship.contains(userId1, userId2)).findFirst().orElse(null);
    }

    default List<Friendship> findAllByUserId(String id) {
        return findAll().stream().filter(friendship -> friendship.contains(id)).toList();
    }
}
