package fr.unice.al.teamh.account.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@Document(collection = "savingAccounts")
public class SavingAccount extends Account {
    private double interestRate = 0;
    private String user;
}
