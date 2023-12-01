package fr.unice.polytech.per.contextmapperforward;

import org.contextmapper.dsl.cml.CMLResource;
import org.contextmapper.dsl.generator.ContextMapGenerator;
import org.contextmapper.dsl.standalone.ContextMapperStandaloneSetup;
import org.contextmapper.dsl.standalone.StandaloneContextMapperAPI;

import java.io.File;

public class Main {
    public static void main(String[] args) {
        // get resources path
        File folder = new File(getResourcesPath("models"));
        for (File file : folder.listFiles()) {
            // read the cml file and create the model
            System.out.println(file.getPath());
            StandaloneContextMapperAPI contextMapperAPI = ContextMapperStandaloneSetup.getStandaloneAPI();
            CMLResource cmlResource = contextMapperAPI.loadCML(getResourcesPath("models/" + file.getName()));

            ContextMapGenerator contextMapGenerator = new ContextMapGenerator();
            contextMapperAPI.callGenerator(cmlResource, contextMapGenerator);
        }
    }


    private static String getResourcesPath(String fileName) {
        return Main.class.getClassLoader().getResource(fileName).getPath();
    }

    public static void listFilesForFolder(final File folder) {
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isDirectory()) {
                listFilesForFolder(fileEntry);
            } else {
                System.out.println(fileEntry.getPath());
            }
        }
    }
}