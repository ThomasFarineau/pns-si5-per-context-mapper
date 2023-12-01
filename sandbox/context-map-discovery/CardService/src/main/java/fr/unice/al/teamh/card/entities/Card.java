package fr.unice.al.teamh.card.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Date;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Document(collection = "cards")
public class Card {
    @Id
    private String id;
    private String cardNumber;
    private String privateCryptogram;
    private Date expirationDate;
    private String account;
    private double spendingLimit;

    public void generate() {
        this.generateCardNumber();
        this.generatePrivateCryptogram();
        this.generateExpirationDate();
    }

    private void generateCardNumber() {
        Random rand = new Random();
        this.cardNumber = "4" + IntStream.range(0, 15).mapToObj(i -> String.valueOf(rand.nextInt(10))).collect(Collectors.joining());
    }

    private void generatePrivateCryptogram() {
        Random rand = new Random();
        this.privateCryptogram = IntStream.range(0, 3).mapToObj(i -> String.valueOf(rand.nextInt(10))).collect(Collectors.joining());
    }

    private void generateExpirationDate() {
        LocalDate date = LocalDate.now().plusYears(5);
        this.expirationDate = Date.from(date.atStartOfDay().atZone(java.time.ZoneId.systemDefault()).toInstant());
    }
}
