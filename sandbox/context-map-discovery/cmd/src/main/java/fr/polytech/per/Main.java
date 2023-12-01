package fr.polytech.per;

import org.contextmapper.discovery.ContextMapDiscoverer;
import org.contextmapper.discovery.ContextMapSerializer;
import org.contextmapper.discovery.model.ContextMap;
import org.contextmapper.discovery.strategies.boundedcontexts.SpringBootBoundedContextDiscoveryStrategy;
import org.contextmapper.discovery.strategies.names.SeparatorToCamelCaseBoundedContextNameMappingStrategy;
import org.contextmapper.discovery.strategies.relationships.DockerComposeRelationshipDiscoveryStrategy;

import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {
        File dockerComposeFile = new File("./docker-compose.yaml");
        System.out.println(dockerComposeFile.getAbsolutePath());

        ContextMapDiscoverer discoverer = new ContextMapDiscoverer()
                .usingBoundedContextDiscoveryStrategies(
                        new SpringBootBoundedContextDiscoveryStrategy("fr.unice.al.teamh"));
        // start discovery process creating a Context Map
        ContextMap contextmap = discoverer.discoverContextMap();

        // store Context Map as Context Mapper DSL (CML) model:
        new ContextMapSerializer().serializeContextMap(contextmap, new File("./src-gen/my-context-map.cml"));
    }
}