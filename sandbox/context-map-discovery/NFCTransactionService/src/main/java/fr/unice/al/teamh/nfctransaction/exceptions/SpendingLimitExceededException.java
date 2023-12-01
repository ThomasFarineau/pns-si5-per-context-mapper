package fr.unice.al.teamh.nfctransaction.exceptions;

public class SpendingLimitExceededException extends Exception {
    public SpendingLimitExceededException(String message) {
        super("Limit Exceeded :" + message);
    }
}
