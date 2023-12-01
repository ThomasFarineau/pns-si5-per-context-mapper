package fr.unice.al.teamh.user.services;

import fr.unice.al.teamh.user.components.dto.AccountDtoOut;
import fr.unice.al.teamh.user.components.dto.UserDto;
import fr.unice.al.teamh.user.entities.User;
import fr.unice.al.teamh.user.exceptions.AccountServiceException;
import fr.unice.al.teamh.user.exceptions.UserNotFoundException;
import fr.unice.al.teamh.user.mappers.UserMapper;
import fr.unice.al.teamh.user.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;

    @Value("${proxy.url}")
    private String proxyUrl;

    public User createUser(UserDto user) {
        log.info("UserService: createUser");
        RestTemplate restTemplate = new RestTemplate();
        // create account
        AccountDtoOut newAccount = restTemplate.postForObject(proxyUrl + "g/account-service/api/accounts", new AccountDtoOut(), AccountDtoOut.class);
        if (newAccount == null) throw new AccountServiceException();

        User newUser = userMapper.userDtoToUser(user);
        newUser.setAccount(newAccount.getId());
        return userRepository.save(newUser);
    }

    public User findById(String id) {
        log.info("UserService: findById");
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    public List<User> findAll() {
        log.info("UserService: findAll");
        return userRepository.findAll();
    }

    public void deleteById(String id) {
        log.info("UserService: deleteById");
        userRepository.deleteById(id);
    }
}
