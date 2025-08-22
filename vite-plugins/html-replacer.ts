import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';


// vibe coded thing to make the SEO stuff work for now
export function htmlReplacer(): Plugin {
    let config: Record<string, string> = {};

    const generateConfigJson = () => {
        try {
            // Read the TS file content
            const configPath = path.resolve('site-config.ts');
            const content = fs.readFileSync(configPath, 'utf8');

            // Extract just the config object more carefully
            const configMatch = content.match(/export const siteConfig[^=]*=\s*({[\s\S]*?});/);
            if (configMatch) {
                let configStr = configMatch[1].trim();

                // Clean up the object string and make it valid JSON
                // Handle quotes properly by converting to JSON step by step
                const lines = configStr.split('\n');
                const cleanLines = lines.map(line => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('//') || trimmed === '{' || trimmed === '}' || trimmed === '') {
                        return trimmed;
                    }

                    // Handle key-value pairs
                    const match = trimmed.match(/^(\w+):\s*"([^"]*(?:\\.[^"]*)*)",?$/);
                    if (match) {
                        const [, key, value] = match;
                        return `    "${key}": "${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"${trimmed.endsWith(',') ? ',' : ''}`;
                    }
                    return trimmed;
                });

                // Reconstruct and parse
                configStr = cleanLines.join('\n').replace(/,(\s*})/, '$1');

                try {
                    const configObj = JSON.parse(configStr);
                    fs.writeFileSync('site-config.generated.json', JSON.stringify(configObj, null, 2));
                    return configObj;
                } catch (parseError) {
                    console.warn('Failed to parse config object:', (parseError as Error).message);

                    // Fallback: manually create config from the TypeScript content
                    const fallbackConfig: Record<string, string> = {};

                    const extractValue = (key: string) => {
                        const regex = new RegExp(`${key}:\\s*"([^"]*(?:\\\\.[^"]*)*)"`, 'g');
                        const match = regex.exec(content);
                        return match ? match[1] : '';
                    };

                    fallbackConfig.siteName = extractValue('siteName');
                    fallbackConfig.siteDescription = extractValue('siteDescription');
                    fallbackConfig.siteUrl = extractValue('siteUrl');
                    fallbackConfig.defaultImage = extractValue('defaultImage');
                    fallbackConfig.siteKeywords = extractValue('siteKeywords');
                    fallbackConfig.siteAuthor = extractValue('siteAuthor');
                    fallbackConfig.siteImage = extractValue('siteImage');
                    fallbackConfig.siteContactEmail = extractValue('siteContactEmail');

                    fs.writeFileSync('site-config.generated.json', JSON.stringify(fallbackConfig, null, 2));
                    return fallbackConfig;
                }
            }
        } catch (error) {
            console.warn('Failed to generate config JSON:', (error as Error).message);
        }
        return {};
    };

    const loadConfig = () => {
        try {
            // Try to read existing generated JSON file
            const jsonPath = path.resolve('site-config.generated.json');
            if (fs.existsSync(jsonPath)) {
                const configContent = fs.readFileSync(jsonPath, 'utf8');
                config = JSON.parse(configContent);
            } else {
                // Generate it if it doesn't exist
                config = generateConfigJson();
            }
        } catch (error) {
            console.warn('Could not load site config:', (error as Error).message);
            config = {};
        }
    };

    return {
        name: 'html-replacer',
        buildStart() {
            loadConfig();
        },
        configureServer(server) {
            // Watch for changes to site-config.ts
            server.watcher.add(path.resolve('site-config.ts'));
            server.watcher.on('change', (file) => {
                if (file.endsWith('site-config.ts')) {
                    // Regenerate the JSON file when TS file changes
                    config = generateConfigJson();
                    server.ws.send({
                        type: 'full-reload'
                    });
                }
            });
        },
        transformIndexHtml(html) {
            let transformedHtml = html;

            // Automatically replace all config entries
            Object.entries(config).forEach(([key, value]) => {
                const placeholder = new RegExp(`{${key}}`, 'g');
                transformedHtml = transformedHtml.replace(placeholder, String(value));
            });

            return transformedHtml;
        }
    };
}
