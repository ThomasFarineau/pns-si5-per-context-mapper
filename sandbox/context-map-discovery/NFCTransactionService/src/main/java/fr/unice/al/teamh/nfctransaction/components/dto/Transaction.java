package fr.unice.al.teamh.nfctransaction.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Transaction {
    private String receiver;
    private String sender;
    private double amount;
    private String type;
}
