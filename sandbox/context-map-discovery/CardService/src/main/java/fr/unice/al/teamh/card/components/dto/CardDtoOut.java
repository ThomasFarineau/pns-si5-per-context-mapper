package fr.unice.al.teamh.card.components.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CardDtoOut {
    private String id;
    private String cardNumber;
    private String privateCryptogram;
    private Date expirationDate;
    private String account;
    private double spendingLimit;
}
