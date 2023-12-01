package fr.unice.al.teamh.friendship.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Document(collection = "friendships")
public class Friendship {
    @Id
    private String id;
    private Set<String> users;

    public void setUsers(Set<String> users) {
        if (users == null || users.size() != 2) throw new IllegalArgumentException("Must have exactly 2 users");
        this.users = users;
    }

    public boolean contains(String id) {
        return users.stream().anyMatch(user -> user.equals(id));
    }

    public boolean contains(String id1, String id2) {
        return users.stream().anyMatch(user -> user.equals(id1)) && users.stream().anyMatch(user -> user.equals(id2));
    }
}
