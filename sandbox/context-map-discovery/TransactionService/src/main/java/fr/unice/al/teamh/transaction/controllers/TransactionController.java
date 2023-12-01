package fr.unice.al.teamh.transaction.controllers;

import fr.unice.al.teamh.transaction.components.dto.TransactionDto;
import fr.unice.al.teamh.transaction.components.dto.TransactionOperationDTO;
import fr.unice.al.teamh.transaction.entities.Transaction;
import fr.unice.al.teamh.transaction.exceptions.TransactionNotFoundException;
import fr.unice.al.teamh.transaction.mappers.TransactionMapper;
import fr.unice.al.teamh.transaction.mappers.context.TransactionMapperContext;
import fr.unice.al.teamh.transaction.services.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transaction Management")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private TransactionMapper transactionMapper;
    @Autowired
    private TransactionMapperContext transactionMapperContext;

    @PostMapping
    public boolean createTransaction(@RequestBody TransactionDto transaction) {
        return transactionService.createTransaction(transaction) != null;
    }

    @GetMapping("/{accountId}/{page}")
    public Iterable<TransactionOperationDTO> getPaginatedTransactions(@PathVariable String accountId, @PathVariable int page) {
        return transactionService.getPaginatedTransactions(accountId, page).stream().map(e -> transactionMapper.transactionToTransactionOperationDTO(e, accountId)).toList();
    }

    @GetMapping
    public Iterable<TransactionDto> get() {
        return transactionService.findAll().stream().map(e -> transactionMapper.transactionToTransactionDto(e, transactionMapperContext)).toList();
    }

    @GetMapping("/{id}")
    public Transaction getById(@PathVariable String id) {
        try {
            return transactionService.findById(id);
        } catch (TransactionNotFoundException e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
