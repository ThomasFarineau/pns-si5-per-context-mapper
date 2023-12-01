package fr.unice.al.teamh.transaction.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionAccountReturnDto {
    private String receiver;
    private String sender;
    private double amount;
    private boolean success;
    private String message;
}
