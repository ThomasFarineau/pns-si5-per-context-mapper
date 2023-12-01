package fr.unice.al.teamh.account.mappers;


import fr.unice.al.teamh.account.components.dto.SavingAccountDtoOut;
import fr.unice.al.teamh.account.entities.SavingAccount;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {AccountMapper.class})
public interface SavingAccountMapper {
    SavingAccountDtoOut savingAccountToSavingAccountDtoOut(SavingAccount savingAccount);
}
