package fr.unice.al.teamh.transaction.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionDto {
    private String receiver;
    private String sender;
    private double amount;
    private String type;
}
