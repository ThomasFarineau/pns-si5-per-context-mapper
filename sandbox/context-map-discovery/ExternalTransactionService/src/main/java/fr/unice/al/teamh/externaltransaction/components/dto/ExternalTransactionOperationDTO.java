package fr.unice.al.teamh.externaltransaction.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExternalTransactionOperationDTO {
    private String from;
    private String to;
    private double amount;
    private TransactionType type;
}
