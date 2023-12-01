package fr.unice.al.teamh.transaction.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionOperationDTO {
    private String from;
    private String to;
    private double amount;
    private TransactionAction action;
    private TransactionType type;
    private String date;
}
