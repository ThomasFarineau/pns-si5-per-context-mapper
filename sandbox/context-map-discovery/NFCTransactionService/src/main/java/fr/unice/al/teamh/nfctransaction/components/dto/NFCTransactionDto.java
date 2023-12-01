package fr.unice.al.teamh.nfctransaction.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NFCTransactionDto {
    private String cardReceiverId;
    private String cardSenderId;
    private double amount;
}

