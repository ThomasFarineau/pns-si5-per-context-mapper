package fr.unice.al.teamh.entities;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Getter
@Setter
@RequiredArgsConstructor
@ToString
public class RestService {
    @Id
    private final String id;
    private int index = 0;
    private Set<Host> hosts = new HashSet<>();

    public void addHost(String host) {
        hosts.add(new Host(host));
    }

    public Optional<String> nextHost() {
        if (hosts.isEmpty()) return Optional.empty();
        for (int i = 0; i < hosts.size(); i++) {
            String toReturn = (hosts.toArray(new Host[0])[index]).getHost();
            index = (index + 1) % hosts.size();
            if (!(hosts.toArray(new Host[0])[index]).isTimeout()) {
                return Optional.of(toReturn);
            }
        }
        return Optional.empty();
    }

    public void unavailableHost(String host) {
        hosts.stream()
                .filter(h -> h.getHost().equals(host))
                .findFirst()
                .ifPresent(Host::setTimeout);
    }
}
