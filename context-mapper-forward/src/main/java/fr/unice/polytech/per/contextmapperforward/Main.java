package fr.unice.polytech.per.contextmapperforward;

import org.contextmapper.dsl.cml.CMLResource;
import org.contextmapper.dsl.generator.ContextMapGenerator;
import org.contextmapper.dsl.standalone.ContextMapperStandaloneSetup;
import org.contextmapper.dsl.standalone.StandaloneContextMapperAPI;

public class Main {
    public static void main(String[] args) {
        // get resources path
        String cmlFilePath = getResoucesPath("models/example.cml");
        System.out.println(cmlFilePath);

        // read the cml file and create the model
        StandaloneContextMapperAPI contextMapperAPI = ContextMapperStandaloneSetup.getStandaloneAPI();
        CMLResource cmlResource = contextMapperAPI.loadCML(cmlFilePath);

        ContextMapGenerator contextMapGenerator = new ContextMapGenerator();
        contextMapperAPI.callGenerator(cmlResource, contextMapGenerator);
    }


    private static String getResoucesPath(String fileName) {
        return Main.class.getClassLoader().getResource(fileName).getPath();
    }
}