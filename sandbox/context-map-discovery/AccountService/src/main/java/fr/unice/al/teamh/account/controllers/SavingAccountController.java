package fr.unice.al.teamh.account.controllers;

import fr.unice.al.teamh.account.components.dto.AccountOperationsDtoOut;
import fr.unice.al.teamh.account.components.dto.SavingAccountDtoIn;
import fr.unice.al.teamh.account.components.dto.SavingAccountDtoOut;
import fr.unice.al.teamh.account.mappers.SavingAccountMapper;
import fr.unice.al.teamh.account.services.SavingAccountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savingaccounts")
@Tag(name = "Saving Accounts")
public class SavingAccountController {
    @Autowired
    private SavingAccountService savingAccountService;
    @Autowired
    private SavingAccountMapper savingAccountMapper;

    @GetMapping
    public List<SavingAccountDtoOut> get() {
        return savingAccountService.findAll().stream().map(savingAccountMapper::savingAccountToSavingAccountDtoOut).toList();
    }

    @GetMapping("/{id}")
    public AccountOperationsDtoOut getById(@PathVariable String id) {
        return savingAccountMapper.savingAccountToSavingAccountDtoOut(savingAccountService.findById(id));
    }

    @PostMapping
    public void save(@RequestBody SavingAccountDtoIn savingAccountDtoIn) {
        savingAccountService.create(savingAccountDtoIn.getUserId());
    }

}
