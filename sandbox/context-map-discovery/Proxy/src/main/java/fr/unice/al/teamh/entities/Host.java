package fr.unice.al.teamh.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Objects;

@Getter
@Setter
public class Host {
    private static final int TIMEOUT = 10;
    private String host;
    private Instant timeout;

    public Host(String host) {
        this.host = host;
        this.timeout = Instant.now();
    }

    public boolean isTimeout() {
        if (timeout == null) return false;
        return Instant.now().isBefore(timeout);
    }

    public void setTimeout() {
        this.timeout = Instant.now().plusSeconds(TIMEOUT);
    }

    @Override
    public String toString() {
        return "Host{" +
                "host='" + host + '\'' +
                ", timeout=" + timeout +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Host host1 = (Host) o;
        return host.equals(host1.host) && Objects.equals(timeout, host1.timeout);
    }

    @Override
    public int hashCode() {
        return Objects.hash(host);
    }
}
