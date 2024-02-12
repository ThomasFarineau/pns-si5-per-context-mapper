package fr.unice.polytech.per.parser;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class ArgParser {
    private final Map<String, String> args = new HashMap<>();
    private String[] possibilities;

    public ArgParser() {
    }

    public void parse(String... args) {
        Map<String, String> map = new HashMap<>();
        for (String arg : args) {
            int toSubstr = arg.startsWith("--") ? 2 : arg.startsWith("-") ? 1 : 0;
            String[] split = arg.split("=");
            String key = split[0].substring(toSubstr);
            if (this.possibilities != null && !Arrays.asList(this.possibilities).contains(key)) {
                throw new IllegalArgumentException("Invalid argument: " + key);
            }
            if (split.length == 2) {
                map.put(key, split[1]);
            }
        }
        this.args.putAll(map);
    }

    public String get(String key) {
        return args.get(key);
    }

    public boolean contains(String key) {
        return args.containsKey(key);
    }

    public String getAll() {
        return args.toString();
    }

    public void correlate(String input, String i) {
        if (args.containsKey(input)) {
            args.put(i, args.get(input));
        } else if (args.containsKey(i)) {
            args.put(input, args.get(i));
        }
    }

    public void setPossibilities(String... possibilities) {
        this.possibilities = possibilities;
    }
}
