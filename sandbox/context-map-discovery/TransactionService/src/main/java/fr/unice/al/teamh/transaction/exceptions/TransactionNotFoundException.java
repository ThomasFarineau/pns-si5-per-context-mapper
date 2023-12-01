package fr.unice.al.teamh.transaction.exceptions;

public class TransactionNotFoundException extends Exception {
    public TransactionNotFoundException(String id) {
        super("Transaction " + id + " not found");
    }
}
