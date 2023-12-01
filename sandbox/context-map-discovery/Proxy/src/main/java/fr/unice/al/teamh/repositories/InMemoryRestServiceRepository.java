package fr.unice.al.teamh.repositories;

import fr.unice.al.teamh.entities.RestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
@Slf4j
public class InMemoryRestServiceRepository implements RestServiceRepository {
    private final Map<String, RestService> storage = new ConcurrentHashMap<>();

    @Override
    public List<RestService> findAll() {
        return List.copyOf(storage.values());
    }

    @Override
    public RestService save(String id) {
        log.info("save " + id);
        RestService restService = new RestService(id);
        storage.put(restService.getId(), restService);
        return restService;
    }

    @Override
    public Optional<RestService> findById(String id) {
        if (id == null) return Optional.empty();
        RestService restService = storage.get(id);
        log.info("findById " + id + " -> " + restService);
        if (restService == null) return Optional.empty();
        return Optional.of(restService);
    }

    @Override
    public void deleteById(String id) {
        storage.remove(id);
    }
}
