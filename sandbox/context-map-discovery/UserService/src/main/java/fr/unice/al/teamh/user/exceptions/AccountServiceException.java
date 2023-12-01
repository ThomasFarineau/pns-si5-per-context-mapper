package fr.unice.al.teamh.user.exceptions;

public class AccountServiceException extends RuntimeException {
    public AccountServiceException() {
        super("Account service is not available, unable to create account");
    }
}
