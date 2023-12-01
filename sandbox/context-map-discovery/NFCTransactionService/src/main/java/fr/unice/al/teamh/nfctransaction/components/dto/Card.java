package fr.unice.al.teamh.nfctransaction.components.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Card {
    @Id
    private String id;
    private String cardNumber;
    private String privateCryptogram;
    private Date expirationDate;
    private String account;
    private double spendingLimit;
}
