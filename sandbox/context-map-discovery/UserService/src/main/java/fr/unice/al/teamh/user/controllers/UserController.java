package fr.unice.al.teamh.user.controllers;

import fr.unice.al.teamh.user.components.dto.UserDto;
import fr.unice.al.teamh.user.components.dto.UserInfoDto;
import fr.unice.al.teamh.user.mappers.UserMapper;
import fr.unice.al.teamh.user.services.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping
    public void save(@RequestBody UserDto user) {
        userService.createUser(user);
    }

    @GetMapping
    public Iterable<UserInfoDto> get() {
        return userService.findAll().stream().map(userMapper::userToUserInfoDto).toList();
    }

    @GetMapping("/{id}")
    public UserInfoDto getById(@PathVariable String id) {
        return userMapper.userToUserInfoDto(userService.findById(id));
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable String id) {
        userService.deleteById(id);
    }
}
