package fr.unice.al.teamh.account.mappers;


import fr.unice.al.teamh.account.components.dto.AccountDtoOut;
import fr.unice.al.teamh.account.entities.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    default AccountDtoOut accountToAccountDto(Account account) {
        AccountDtoOut accountDtoOut = new AccountDtoOut();
        accountDtoOut.setId(account.getId());
        accountDtoOut.setBalance(account.getBalance());
        accountDtoOut.setIban(account.getIban());
        accountDtoOut.setSwift(account.getSwift());
        return accountDtoOut;
    }

}
