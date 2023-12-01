package fr.unice.al.teamh.nfctransaction.controllers;

import fr.unice.al.teamh.nfctransaction.components.dto.NFCTransactionDto;
import fr.unice.al.teamh.nfctransaction.exceptions.AccountNotFoundException;
import fr.unice.al.teamh.nfctransaction.exceptions.SpendingLimitExceededException;
import fr.unice.al.teamh.nfctransaction.service.NFCTransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "NFC Transaction Management")
public class TransactionController {
    @Autowired
    private NFCTransactionService transactionService;

    @PostMapping
    public void createTransaction(@RequestBody NFCTransactionDto transaction) {
        try {
            transactionService.createTransaction(transaction);
        } catch (AccountNotFoundException e) {
            e.printStackTrace();
        } catch (SpendingLimitExceededException e) {
            e.printStackTrace();
        }
    }
}
