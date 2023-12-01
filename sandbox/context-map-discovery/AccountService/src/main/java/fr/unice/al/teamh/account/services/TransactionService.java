package fr.unice.al.teamh.account.services;

import fr.unice.al.teamh.account.components.dto.TransactionDtoIn;
import fr.unice.al.teamh.account.components.dto.TransactionDtoOut;
import fr.unice.al.teamh.account.components.dto.TransactionType;
import fr.unice.al.teamh.account.entities.Account;
import fr.unice.al.teamh.account.exceptions.AccountNotFoundException;
import fr.unice.al.teamh.account.exceptions.UserIsPoorException;
import fr.unice.al.teamh.account.mappers.TransactionMapper;
import fr.unice.al.teamh.account.repositories.AccountRepository;
import fr.unice.al.teamh.account.repositories.SavingAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class TransactionService {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private SavingAccountRepository savingAccountRepository;

    @Autowired
    private TransactionMapper transactionMapper;

    public TransactionDtoOut createTransaction(TransactionDtoIn transactionDtoIn) {
        log.info("AccountService: (transaction) createTransaction");
        Account senderAccount = getAccount(transactionDtoIn.getSender(), TransactionType.valueOf(transactionDtoIn.getType()), false);
        Account receiverAccount = getAccount(transactionDtoIn.getReceiver(), TransactionType.valueOf(transactionDtoIn.getType()), true);

        if (senderAccount == null) {
            throw new AccountNotFoundException(senderAccount.getId());
        } else if (receiverAccount == null) {
            throw new AccountNotFoundException(receiverAccount.getId());
        }

        return processTransaction(senderAccount, receiverAccount, transactionDtoIn.getAmount());
    }

    private Account getAccount(String accountId, TransactionType type, boolean isReceiver) {
        Optional<?> accountOpt;
        String accountType = isReceiver ? "Receiver" : "Sender";

        if (type == TransactionType.INTERNAL_ACCOUNT_TO_ACCOUNT || type == TransactionType.INTERNAL_ACCOUNT_TO_SAVING && !isReceiver || type == TransactionType.INTERNAL_SAVING_TO_ACCOUNT && isReceiver) {
            accountOpt = accountRepository.findById(accountId);
        } else {
            accountOpt = savingAccountRepository.findById(accountId);
        }

        if (accountOpt.isEmpty()) {
            log.error(accountType + " account not found");
            return null;
        }

        return (Account) accountOpt.get();
    }

    private TransactionDtoOut processTransaction(Account sender, Account receiver, double amount) {
        if (sender.getBalance() < amount) {
            log.error("Sender account has not enough money");
            throw new UserIsPoorException(sender.getId());
        }

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        accountRepository.save(sender);
        accountRepository.save(receiver);

        return transactionMapper.transactionDtoOut(sender.getId(), receiver.getId(), amount, true, null);
    }

    public TransactionDtoOut createTransactionExterne(TransactionDtoIn transactionDtoIn) {
        Account senderAccount;

        double amount = transactionDtoIn.getAmount();

        try {
            senderAccount = accountService.getById(transactionDtoIn.getSender());
        } catch (Exception e) {
            log.error("Sender account not found");
            return transactionMapper.transactionDtoOut(null, null, amount, false, "Sender account not found");
        }


        if (senderAccount.getBalance() < transactionDtoIn.getAmount()) {
            log.error("Sender account has not enough money");
            return transactionMapper.transactionDtoOut(senderAccount.getId(), null, amount, false, "Sender account has not enough money");
        }

        senderAccount.setBalance(senderAccount.getBalance() - transactionDtoIn.getAmount());

        accountRepository.save(senderAccount);

        return transactionMapper.transactionDtoOut(senderAccount.getId(), null, amount, true, null);
    }
}
