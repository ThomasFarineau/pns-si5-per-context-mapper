package fr.unice.al.teamh.friendtransaction.controllers;

import fr.unice.al.teamh.friendtransaction.components.dto.TransactionDtoIn;
import fr.unice.al.teamh.friendtransaction.services.FriendTransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transaction Management")
public class FriendTransactionController {
    @Autowired
    private FriendTransactionService transactionService;

    @PostMapping
    public boolean createTransaction(@RequestBody TransactionDtoIn transaction) {
        return transactionService.createFriendTransaction(transaction);
    }
}
