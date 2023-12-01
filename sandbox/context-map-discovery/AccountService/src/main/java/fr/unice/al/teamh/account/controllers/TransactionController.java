package fr.unice.al.teamh.account.controllers;

import fr.unice.al.teamh.account.components.dto.TransactionDtoIn;
import fr.unice.al.teamh.account.components.dto.TransactionDtoOut;
import fr.unice.al.teamh.account.services.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transaction")
@Tag(name = "Account transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public TransactionDtoOut createTransactionAccount(@RequestBody TransactionDtoIn transactionDtoIn) {
        return transactionService.createTransaction(transactionDtoIn);
    }

    @PostMapping("/external")
    public TransactionDtoOut createTransactionExterne(@RequestBody TransactionDtoIn transactionDtoIn) {
        return transactionService.createTransactionExterne(transactionDtoIn);
    }

}
