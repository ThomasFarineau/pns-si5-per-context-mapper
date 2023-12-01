package fr.unice.polytech.per.contextmapdiscovery;

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
        // configure the discoverer
        ContextMapDiscoverer discoverer = new ContextMapDiscoverer()
                .usingBoundedContextDiscoveryStrategies(
                        new SpringBootBoundedContextDiscoveryStrategy("com.lakesidemutual"))
                .usingRelationshipDiscoveryStrategies(
                        new DockerComposeRelationshipDiscoveryStrategy(
                                new File(System.getProperty("user.home") + "/source/LakesideMutual/")))
                .usingBoundedContextNameMappingStrategies(
                        new SeparatorToCamelCaseBoundedContextNameMappingStrategy("-") {
                            @Override
                            public String mapBoundedContextName(String s) {
                                // remove the "Backend" part of the Docker service names to map correctly...
                                String name = super.mapBoundedContextName(s);
                                return name.endsWith("Backend") ? name.substring(0, name.length() - 7) : name;
                            }
                        });

        // run the discovery process to get the Context Map
        ContextMap contextmap = discoverer.discoverContextMap();

        // serialize the Context Map to CML
        new ContextMapSerializer().serializeContextMap(contextmap, new File("./src-gen/lakesidemutual.cml"));
    }
}