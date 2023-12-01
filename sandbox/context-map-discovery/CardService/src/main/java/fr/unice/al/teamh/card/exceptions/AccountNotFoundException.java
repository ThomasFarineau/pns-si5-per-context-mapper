package fr.unice.al.teamh.card.exceptions;

public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String id) {
        super("Could not find account " + id);
    }
}
