package fr.unice.al.teamh.account.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Random;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@Document(collection = "accounts")
public class Account {

    @Transient
    final int TOTAL_IBAN_LENGTH = 27;
    @Transient
    String COUNTRY_CODE = "FR";
    @Transient
    String CONTROL_KEY = "06";
    @Transient
    String BANK_CODE = "01110";
    @Transient
    String AGENCY_CODE = "01010";

    @Id
    private String id;
    private double balance = 0;
    private String accountId;
    private String rib;
    private String iban;

    public Account() {
        accountId = generateId();
        rib = generateRib();
    }

    private String generateRib() {
        Random random = new Random();
        int ribKeyLength = 2;
        return random.ints(0, 10).limit(ribKeyLength).mapToObj(Integer::toString).collect(Collectors.joining());
    }

    public String getIban() {
        return COUNTRY_CODE + CONTROL_KEY + BANK_CODE + AGENCY_CODE + accountId + rib;
    }

    public String getSwift() {
        return "ALNBFR06001";
    }

    private String generateId() {
        Random random = new Random();
        int accountNumberLength = TOTAL_IBAN_LENGTH - (COUNTRY_CODE.length() + CONTROL_KEY.length() + BANK_CODE.length() + AGENCY_CODE.length()) - 2;
        return random.ints(0, 10).limit(accountNumberLength).mapToObj(Integer::toString).collect(Collectors.joining());
    }
}
