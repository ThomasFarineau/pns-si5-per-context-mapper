package fr.unice.al.teamh.account.mappers;

import fr.unice.al.teamh.account.components.dto.TransactionDtoOut;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionDtoOut transactionDtoOut(String sender, String receiver, double amount, boolean success, String message);
}
