package fr.unice.al.teamh.account.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionDtoIn {
    private String receiver;
    private String sender;
    private double amount;
    private String type;
}
