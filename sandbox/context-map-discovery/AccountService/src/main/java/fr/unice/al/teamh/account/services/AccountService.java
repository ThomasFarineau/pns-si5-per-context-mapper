package fr.unice.al.teamh.account.services;

import fr.unice.al.teamh.account.components.dto.AccountOperationsDtoOut;
import fr.unice.al.teamh.account.components.dto.TransactionOperationDTO;
import fr.unice.al.teamh.account.entities.Account;
import fr.unice.al.teamh.account.exceptions.AccountNotFoundException;
import fr.unice.al.teamh.account.repositories.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Value("${proxy.url}")
    private String proxyUrl;

    public List<Account> findAll() {
        log.info("AccountService: findAll");
        return accountRepository.findAll();
    }

    public AccountOperationsDtoOut findById(String id) {
        log.info("AccountService: findById");
        Account account = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(id));
        AccountOperationsDtoOut accountDtoOut = new AccountOperationsDtoOut();
        accountDtoOut.setId(account.getId());
        accountDtoOut.setBalance(account.getBalance());
        accountDtoOut.setIban(account.getIban());
        accountDtoOut.setSwift(account.getSwift());
        RestTemplate restTemplate = new RestTemplate();
        String url = proxyUrl + "g/transaction-service/api/transactions/" + account.getId() + "/0";
        List<TransactionOperationDTO> transactions = (List<TransactionOperationDTO>) restTemplate.getForObject(url, Iterable.class);
        accountDtoOut.setOperations(transactions);
        System.out.println(transactions);
        return accountDtoOut;
    }

    public Account createAccount(Account account) {
        log.info("AccountService: createAccount");
        return accountRepository.save(account);
    }

    public Account add(String id, double amount) {
        log.info("AccountService: add");
        Account account = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(id));
        account.setBalance(account.getBalance() + amount);
        return accountRepository.save(account);
    }

    public Account getById(String senderId) {
        log.info("AccountService: getById");
        return accountRepository.findById(senderId).orElseThrow(() -> new AccountNotFoundException(senderId));
    }
}
