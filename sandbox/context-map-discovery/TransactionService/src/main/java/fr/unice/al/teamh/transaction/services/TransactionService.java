package fr.unice.al.teamh.transaction.services;

import fr.unice.al.teamh.transaction.components.dto.TransactionAccountReturnDto;
import fr.unice.al.teamh.transaction.components.dto.TransactionDto;
import fr.unice.al.teamh.transaction.components.dto.TransactionType;
import fr.unice.al.teamh.transaction.entities.Transaction;
import fr.unice.al.teamh.transaction.exceptions.TransactionFailedException;
import fr.unice.al.teamh.transaction.exceptions.TransactionNotFoundException;
import fr.unice.al.teamh.transaction.repositories.TransactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
public class TransactionService {

    private final int PAGE_SIZE = 10;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${proxy.url}")
    private String proxyUrl;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    public Transaction findById(String id) throws TransactionNotFoundException {
        return transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException(id));
    }

    public List<Transaction> getPaginatedTransactions(String accountId, int page) {
        // the page is 1-indexed
        int offset = (page - 1) * PAGE_SIZE;
        return transactionRepository.getPaginatedTransactions(accountId, PAGE_SIZE, offset);
    }

    public Transaction createTransaction(TransactionDto transactionDto) {
        log.info("TransactionService: createTransaction");
        Transaction transaction = new Transaction();
        transaction.setSender(transactionDto.getSender());
        transaction.setReceiver(transactionDto.getReceiver());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setType(TransactionType.valueOf(transactionDto.getType()));
        if (!transaction.getType().equals(TransactionType.EXTERNAL)) {
            TransactionAccountReturnDto transactionAccountReturnDto = restTemplate.postForObject(proxyUrl + "g/account-service/api/transaction", transactionDto, TransactionAccountReturnDto.class);
            if (transactionAccountReturnDto == null) {
                log.error("TransactionAccountReturnDto is null");
                throw new TransactionFailedException();
            }
        }
        return transactionRepository.save(transaction);
    }
}