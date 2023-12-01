package fr.unice.al.teamh.externaltransaction.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Document(collection = "transactions")
public class ExternalTransaction {
    @Id
    private String id;
    private String sender;
    private String receiver;
    private Instant createdAt = Instant.now();
    private double amount;
}
