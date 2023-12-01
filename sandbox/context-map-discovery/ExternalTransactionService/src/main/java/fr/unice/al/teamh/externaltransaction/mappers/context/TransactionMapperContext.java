package fr.unice.al.teamh.externaltransaction.mappers.context;

import fr.unice.al.teamh.externaltransaction.components.dto.ExternalTransactionDto;
import fr.unice.al.teamh.externaltransaction.entities.ExternalTransaction;
import fr.unice.al.teamh.externaltransaction.mappers.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.mapstruct.AfterMapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TransactionMapperContext {

    private final TransactionMapper transactionMapper;

    @AfterMapping
    public void transactionToTransactionDtoAfterMapping(ExternalTransaction source, @MappingTarget ExternalTransactionDto target) {
        target.setSender(source.getSender());
    }
}