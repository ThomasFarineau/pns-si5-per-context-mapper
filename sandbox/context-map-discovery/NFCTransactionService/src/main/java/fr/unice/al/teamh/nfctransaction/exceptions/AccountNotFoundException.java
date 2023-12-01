package fr.unice.al.teamh.nfctransaction.exceptions;

public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String id) {
        super("Could not find account " + id);
    }
}

