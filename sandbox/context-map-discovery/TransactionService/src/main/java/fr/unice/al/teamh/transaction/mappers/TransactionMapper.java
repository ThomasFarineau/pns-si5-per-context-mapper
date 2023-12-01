package fr.unice.al.teamh.transaction.mappers;

import fr.unice.al.teamh.transaction.components.dto.TransactionAction;
import fr.unice.al.teamh.transaction.components.dto.TransactionDto;
import fr.unice.al.teamh.transaction.components.dto.TransactionOperationDTO;
import fr.unice.al.teamh.transaction.entities.Transaction;
import fr.unice.al.teamh.transaction.mappers.context.TransactionMapperContext;
import org.mapstruct.Context;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionDto transactionToTransactionDto(Transaction transaction, @Context TransactionMapperContext transactionMapperContext);

    default TransactionOperationDTO transactionToTransactionOperationDTO(Transaction transaction, String accountId) {
        TransactionOperationDTO transactionOperationDTO = new TransactionOperationDTO();
        transactionOperationDTO.setAmount(transaction.getAmount());
        transactionOperationDTO.setFrom(transaction.getSender());
        transactionOperationDTO.setTo(transaction.getReceiver());
        transactionOperationDTO.setAction(transaction.getSender().equals(accountId) ? TransactionAction.SENT : TransactionAction.RECEIVED);
        transactionOperationDTO.setType(transaction.getType());
        transactionOperationDTO.setDate(transaction.getCreatedAt().toString().substring(0, 10));
        return transactionOperationDTO;
    }
}
