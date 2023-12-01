package fr.unice.al.teamh.user.mappers;

import fr.unice.al.teamh.user.components.dto.UserDto;
import fr.unice.al.teamh.user.components.dto.UserInfoDto;
import fr.unice.al.teamh.user.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User userDtoToUser(UserDto userDto);

    UserInfoDto userToUserInfoDto(User user);
}
