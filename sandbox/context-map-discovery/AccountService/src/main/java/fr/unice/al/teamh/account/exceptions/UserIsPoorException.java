package fr.unice.al.teamh.account.exceptions;

public class UserIsPoorException extends RuntimeException {
    public UserIsPoorException(String id) {
        super("User " + id + " is poor");
    }
}
