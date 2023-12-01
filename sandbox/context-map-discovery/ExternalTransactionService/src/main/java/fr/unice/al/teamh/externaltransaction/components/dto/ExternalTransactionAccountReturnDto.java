package fr.unice.al.teamh.externaltransaction.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExternalTransactionAccountReturnDto {
    private String sender;
    private String receiver;
    private double amount;
    private boolean success;
    private String message;
}
