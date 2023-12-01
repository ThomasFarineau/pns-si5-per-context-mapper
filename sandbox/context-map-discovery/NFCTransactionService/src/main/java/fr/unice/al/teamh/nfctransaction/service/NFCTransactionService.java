package fr.unice.al.teamh.nfctransaction.service;

import fr.unice.al.teamh.nfctransaction.components.dto.Card;
import fr.unice.al.teamh.nfctransaction.components.dto.NFCTransactionDto;
import fr.unice.al.teamh.nfctransaction.components.dto.Transaction;
import fr.unice.al.teamh.nfctransaction.components.dto.TransactionType;
import fr.unice.al.teamh.nfctransaction.exceptions.AccountNotFoundException;
import fr.unice.al.teamh.nfctransaction.exceptions.SpendingLimitExceededException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NFCTransactionService {

    @Value("${proxy.url}")
    private String proxyUrl;

    public void createTransaction(NFCTransactionDto transactionDto) throws AccountNotFoundException, SpendingLimitExceededException {
        Transaction transaction = new Transaction();

        Card sender = getRequestCard(transactionDto.getCardSenderId());
        Card receiver = getRequestCard(transactionDto.getCardReceiverId());

        transaction.setSender(sender.getAccount());


        if (sender.equals(null)) {
            throw new AccountNotFoundException(sender.getAccount());
        }

        if (sender.getSpendingLimit() < transactionDto.getAmount()) {
            throw new SpendingLimitExceededException(sender.getAccount());
        }

        transaction.setAmount(transactionDto.getAmount());
        if ((receiver == null)) {
            postRequestExterne(transaction);
        } else {
            transaction.setReceiver(receiver.getAccount());
            postRequestInterne(transaction);
        }
    }

    public Card getRequestCard(String id) {
        RestTemplate restTemplate = new RestTemplate();
        Card response;
        try {
            response = restTemplate.getForObject(proxyUrl + "g/card-service/api/cards/" + id, Card.class);
        } catch (Exception e) {
            return null;
        }
        return response;
    }

    public void postRequestInterne(Transaction transactionDto) {
        transactionDto.setType(TransactionType.INTERNAL_ACCOUNT_TO_ACCOUNT.name());
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForObject(proxyUrl + "g/transaction-service/api/transactions", transactionDto, Boolean.class);
    }

    public void postRequestExterne(Transaction transactionDto) {
        transactionDto.setType(TransactionType.EXTERNAL.name());
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForObject(proxyUrl + "g/external-transaction-service/api/transactions", transactionDto, Boolean.class);
    }
}