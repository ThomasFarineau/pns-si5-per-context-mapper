package fr.unice.al.teamh.transaction.mappers.context;

import fr.unice.al.teamh.transaction.components.dto.TransactionDto;
import fr.unice.al.teamh.transaction.entities.Transaction;
import fr.unice.al.teamh.transaction.mappers.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.mapstruct.AfterMapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TransactionMapperContext {

    private final TransactionMapper transactionMapper;

    @AfterMapping
    public void transactionToTransactionDtoAfterMapping(Transaction source, @MappingTarget TransactionDto target) {
        target.setSender(source.getSender());
        target.setReceiver(source.getReceiver());
    }
}