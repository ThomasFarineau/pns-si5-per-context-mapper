package fr.unice.al.teamh.account.services;

import fr.unice.al.teamh.account.components.dto.UserDtoOut;
import fr.unice.al.teamh.account.entities.SavingAccount;
import fr.unice.al.teamh.account.exceptions.SavingAccountNotFoundException;
import fr.unice.al.teamh.account.exceptions.UserNotFoundException;
import fr.unice.al.teamh.account.repositories.SavingAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
public class SavingAccountService {

    @Autowired
    private SavingAccountRepository savingAccountRepository;

    @Value("${proxy.url}")
    private String proxyUrl;

    public List<SavingAccount> findAll() {
        log.info("SavingAccountService: findAll");
        return savingAccountRepository.findAll();
    }

    public SavingAccount findById(String id) {
        log.info("SavingAccountService: findById");
        return savingAccountRepository.findById(id).orElseThrow(() -> new SavingAccountNotFoundException(id));
    }

    public SavingAccount create(String id) {
        log.info("SavingAccountService: createAccount");

        RestTemplate restTemplate = new RestTemplate();
        UserDtoOut userDtoOut = restTemplate.getForObject(proxyUrl + "g/user-service/api/users/" + id, UserDtoOut.class);

        if (userDtoOut == null) {
            throw new UserNotFoundException(id);
        }

        SavingAccount savingAccount = new SavingAccount();
        savingAccount.setUser(userDtoOut.getId());

        return savingAccountRepository.save(savingAccount);
    }

}
