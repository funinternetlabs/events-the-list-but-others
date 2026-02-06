
import fs from 'fs-extra';
import path from 'path';

/**
 * Fetches data from a URL with local file system caching.
 * Cache key is combined with today's date to create a daily cache.
 */
export async function fetchWithCache(url: string, sourceName: string, extension: string = 'html'): Promise<string> {
    // Cache Naming: {date}-{source}.{ext} (Daily Cache)
    const today = new Date().toISOString().split('T')[0];
    const safeName = sourceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cacheDir = path.resolve('data/cache');
    const cacheFile = path.join(cacheDir, `${today}-${safeName}.${extension}`);
    
    // Simple dev cache: If file exists, use it. To refresh, delete the file.
    // In future we can add time-based expiry or ENV var bypass.
    const useCache = process.env.NO_CACHE !== 'true'; 

    try {
        if (useCache) {
            if (await fs.pathExists(cacheFile)) {
                console.log(`   ⚡️ Cache hit: ${cacheFile}`);
                return await fs.readFile(cacheFile, 'utf-8');
            }
        }
    } catch (e) { console.warn('Cache read check failed', e); }

    console.log(`   🌐 Fetching live: ${url}...`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    
    // Save to cache
    try {
        await fs.ensureDir(cacheDir);
        await fs.writeFile(cacheFile, text);
        console.log(`   💾 Saved to cache: ${cacheFile}`);
    } catch (e) { console.error('Failed to write cache', e); }

    return text;
}
