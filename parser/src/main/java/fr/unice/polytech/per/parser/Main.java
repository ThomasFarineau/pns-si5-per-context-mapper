package fr.unice.polytech.per.parser;

import org.contextmapper.dsl.cml.CMLResource;
import org.contextmapper.dsl.generator.ContextMapGenerator;
import org.contextmapper.dsl.standalone.ContextMapperStandaloneSetup;
import org.contextmapper.dsl.standalone.StandaloneContextMapperAPI;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Main {
    private static final String JAVA_JAR = "java -jar generator.jar";

    public static void main(String... args) {
        ArgParser argParser = new ArgParser();
        argParser.setPossibilities("input", "output", "i", "o", "inputs");
        argParser.parse(args);
        argParser.correlate("input", "i");
        argParser.correlate("output", "o");

        if (!argParser.contains("input") && !argParser.contains("inputs")) {
            String sb = "No input file or directory specified" + "\n" + "Usage: " + JAVA_JAR + " -i=<input file> -o=<output directory>" + "\n" + "Usage: " + JAVA_JAR + " --inputs=<input directory> -o=<output directory>";
            throw new IllegalArgumentException(sb);
        }

        if (!argParser.contains("output")) {
            String sb = "No output directory specified" + "\n" + "Usage: " + JAVA_JAR + " -i=<input file> -o=<output directory>" + "\n" + "Usage: " + JAVA_JAR + " --inputs=<input directory> -o=<output directory>";
            throw new IllegalArgumentException(sb);
        }

        boolean isInputDirectory = argParser.contains("inputs");

        Path input = isInputDirectory ? getAbsolutePath(argParser.get("inputs")) : getAbsolutePath(argParser.get("input"));
        Path output = getAbsolutePath(argParser.get("output"));

        if (!output.toFile().exists()) {
            boolean created = output.toFile().mkdirs();
            if (!created) {
                throw new IllegalArgumentException("Could not create output directory (" + output + ")");
            }
        }

        if (!input.toFile().exists()) {
            throw new IllegalArgumentException("Input file or directory does not exist (" + input + ")");
        }

        if (!isInputDirectory) {
            generate(input.toFile(), output);
        } else {
            File[] files = input.toFile().listFiles();
            if (files == null) {
                throw new IllegalArgumentException("Input directory is empty (" + input + ")");
            }
            for (File file : files) {
                if (file.isFile() && file.getName().endsWith(".cml")) {
                    System.out.println("\nGenerating context map for " + file.getName() + "\n");
                    Path path = Path.of(input.toString(), file.getName());
                    generate(path.toFile(), output);
                }
            }
        }
    }

    private static void generate(File file, Path output) {
        StandaloneContextMapperAPI contextMapperAPI = ContextMapperStandaloneSetup.getStandaloneAPI();
        CMLResource cmlResource = contextMapperAPI.loadCML(file);

        ContextMapGenerator contextMapGenerator = new ContextMapGenerator();
        contextMapperAPI.callGenerator(cmlResource, contextMapGenerator, output.toString());
    }

    private static Path getAbsolutePath(String path) {
        Path relativePath = Paths.get(path);
        return relativePath.toAbsolutePath().normalize();
    }
}