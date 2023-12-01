package fr.unice.al.teamh.account.exceptions;

public class SavingAccountNotFoundException extends RuntimeException {
    public SavingAccountNotFoundException(String id) {
        super("Could not find saving account " + id);
    }
}
