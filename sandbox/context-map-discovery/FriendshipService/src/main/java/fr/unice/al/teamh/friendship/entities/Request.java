package fr.unice.al.teamh.friendship.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Document(collection = "requests")
public class Request {
    @Id
    private String id;
    private String sender;
    private String receiver;
}
