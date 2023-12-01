package fr.unice.al.teamh.card.exceptions;

public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException(String id) {
        super("Could not find card " + id);
    }
}
