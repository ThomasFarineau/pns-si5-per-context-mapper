package fr.unice.al.teamh.account.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountDtoOut {
    protected String id;
    protected double balance;
    protected String iban;
    protected String swift;
}
