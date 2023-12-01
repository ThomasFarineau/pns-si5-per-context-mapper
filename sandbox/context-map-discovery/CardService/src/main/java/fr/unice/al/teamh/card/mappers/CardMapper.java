package fr.unice.al.teamh.card.mappers;


import fr.unice.al.teamh.card.components.dto.CardDtoOut;
import fr.unice.al.teamh.card.entities.Card;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CardMapper {
    CardDtoOut cardToCardDtoOut(Card card);

}
