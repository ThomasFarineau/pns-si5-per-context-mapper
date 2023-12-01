package fr.unice.al.teamh.externaltransaction.services;

import fr.unice.al.teamh.externaltransaction.components.dto.ExternalTransactionAccountReturnDto;
import fr.unice.al.teamh.externaltransaction.components.dto.ExternalTransactionDto;
import fr.unice.al.teamh.externaltransaction.entities.ExternalTransaction;
import fr.unice.al.teamh.externaltransaction.exceptions.TransactionFailedException;
import fr.unice.al.teamh.externaltransaction.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalTransactionService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private TransactionRepository transactionRepository;

    @Value("${externalBank.url}")
    private String externalBankServiceUrl;

    @Value("${proxy.url}")
    private String proxyUrl;

    public ExternalTransaction createTransaction(ExternalTransactionDto transactionDto) throws TransactionFailedException {

        HttpEntity<ExternalTransactionDto> request = new HttpEntity<>(transactionDto);
        Boolean isPossible = restTemplate.postForObject(externalBankServiceUrl + "externalbank/processTransaction", request, Boolean.class);
        if (Boolean.FALSE.equals(isPossible)) {
            throw new TransactionFailedException();
        }
        ExternalTransactionAccountReturnDto transactionAccountReturnDto = restTemplate.postForObject(proxyUrl + "g/account-service/api/transaction/external", request, ExternalTransactionAccountReturnDto.class);


        if (transactionAccountReturnDto == null) {
            System.out.println("TransactionAccountReturnDto is null");
            throw new TransactionFailedException();
        }

        ExternalTransaction transaction = new ExternalTransaction();

        String sender = transactionAccountReturnDto.getSender();

        transaction.setSender(sender);
        transaction.setReceiver("External Receiver");
        transaction.setAmount(transactionDto.getAmount());

        return transactionRepository.save(transaction);

    }
}