package fr.unice.al.teamh.externaltransaction.controllers;

import fr.unice.al.teamh.externaltransaction.components.dto.ExternalTransactionDto;
import fr.unice.al.teamh.externaltransaction.mappers.TransactionMapper;
import fr.unice.al.teamh.externaltransaction.mappers.context.TransactionMapperContext;
import fr.unice.al.teamh.externaltransaction.services.ExternalTransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transaction Management")
public class TransactionController {
    @Autowired
    private ExternalTransactionService transactionService;
    @Autowired
    private TransactionMapper transactionMapper;
    @Autowired
    private TransactionMapperContext transactionMapperContext;

    @PostMapping
    public boolean createTransaction(@RequestBody ExternalTransactionDto transaction) {
        return transactionService.createTransaction(transaction) != null;
    }
}
