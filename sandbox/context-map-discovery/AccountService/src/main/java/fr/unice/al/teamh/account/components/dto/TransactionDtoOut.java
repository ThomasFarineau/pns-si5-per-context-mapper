package fr.unice.al.teamh.account.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionDtoOut {
    private String receiver;
    private String sender;
    private double amount;
    private boolean success;
    private String message;
}
