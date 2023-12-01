package fr.unice.al.teamh.account.controllers;

import fr.unice.al.teamh.account.components.dto.AccountDtoOut;
import fr.unice.al.teamh.account.components.dto.AccountOperationsDtoOut;
import fr.unice.al.teamh.account.entities.Account;
import fr.unice.al.teamh.account.mappers.AccountMapper;
import fr.unice.al.teamh.account.services.AccountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Accounts")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountMapper accountMapper;

    @GetMapping
    public List<AccountDtoOut> get() {
        return accountService.findAll().stream().map(accountMapper::accountToAccountDto).toList();
    }

    @GetMapping("/{id}")
    public AccountOperationsDtoOut getById(@PathVariable String id) {
        return accountService.findById(id);
    }

    @PostMapping
    public AccountDtoOut save(@RequestBody Account account) {
        return accountMapper.accountToAccountDto(accountService.createAccount(account));
    }

    @PutMapping("/{id}/add/{amount}")
    public AccountDtoOut add(@PathVariable String id, @PathVariable double amount) {
        return accountMapper.accountToAccountDto(accountService.add(id, amount));
    }
}
