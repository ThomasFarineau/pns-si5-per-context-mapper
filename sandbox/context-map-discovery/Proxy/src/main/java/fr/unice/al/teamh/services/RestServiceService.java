package fr.unice.al.teamh.services;

import fr.unice.al.teamh.components.dto.ServiceDtoIn;
import fr.unice.al.teamh.entities.RestService;
import fr.unice.al.teamh.repositories.RestServiceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RestServiceService {

    private final RestServiceRepository restServiceRepository;

    public RestServiceService(RestServiceRepository restServiceRepository) {
        this.restServiceRepository = restServiceRepository;
    }

    public void add(ServiceDtoIn serviceDtoIn) {
        log.info("add " + serviceDtoIn);
        Optional<RestService> restService = restServiceRepository.findById(serviceDtoIn.getId());
        if (restService.isPresent()) {
            log.info("add host " + serviceDtoIn.getHost() + " to " + restService.get());
            restService.get().addHost(serviceDtoIn.getHost());
            return;
        }
        RestService newRestService = restServiceRepository.save(serviceDtoIn.getId());
        newRestService.addHost(serviceDtoIn.getHost());
    }

    public List<RestService> getAll() {
        return restServiceRepository.findAll();
    }
}
