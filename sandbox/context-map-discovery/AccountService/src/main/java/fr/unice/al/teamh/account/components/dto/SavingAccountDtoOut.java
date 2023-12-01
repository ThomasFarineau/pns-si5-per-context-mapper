package fr.unice.al.teamh.account.components.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SavingAccountDtoOut extends AccountOperationsDtoOut {
    private double interestRate;
}
