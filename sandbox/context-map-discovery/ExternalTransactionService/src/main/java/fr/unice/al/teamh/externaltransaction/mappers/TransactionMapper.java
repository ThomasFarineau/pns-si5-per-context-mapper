package fr.unice.al.teamh.externaltransaction.mappers;

import fr.unice.al.teamh.externaltransaction.components.dto.ExternalTransactionDto;
import fr.unice.al.teamh.externaltransaction.components.dto.ExternalTransactionOperationDTO;
import fr.unice.al.teamh.externaltransaction.components.dto.TransactionType;
import fr.unice.al.teamh.externaltransaction.entities.ExternalTransaction;
import fr.unice.al.teamh.externaltransaction.mappers.context.TransactionMapperContext;
import org.mapstruct.Context;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    ExternalTransactionDto transactionToTransactionDto(ExternalTransaction transaction, @Context TransactionMapperContext transactionMapperContext);

    default ExternalTransactionOperationDTO transactionToTransactionOperationDTO(ExternalTransaction transaction, String accountId) {
        ExternalTransactionOperationDTO transactionOperationDTO = new ExternalTransactionOperationDTO();
        transactionOperationDTO.setAmount(transaction.getAmount());
        transactionOperationDTO.setFrom(transaction.getSender());
        transactionOperationDTO.setTo("External Receiver");
        transactionOperationDTO.setType(transaction.getSender().equals(accountId) ? TransactionType.SENT : TransactionType.RECEIVED);
        return transactionOperationDTO;
    }
}
