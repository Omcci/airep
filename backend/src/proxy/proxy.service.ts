import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);

    private readonly browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
    };

    async fetchContent(url: string): Promise<string> {
        try {
            // Add browser-like headers
            const response = await fetch(url, {
                headers: this.browserHeaders,
                redirect: 'follow'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove unwanted elements
            $('script').remove();
            $('style').remove();
            $('nav').remove();
            $('header').remove();
            $('footer').remove();
            $('.ad').remove();
            $('.advertisement').remove();
            $('.social-share').remove();
            $('.comments').remove();

            // BBC-specific selectors
            if (url.includes('bbc.com') || url.includes('bbc.co.uk')) {
                const article = $('article[data-component="text-block"]');
                if (article.length) {
                    const title = $('h1').first().text().trim();
                    const content = article.text().trim();
                    return title ? `${title}\n\n${content}` : content;
                }
            }

            // Get the main content
            let content = '';
            let title = '';

            // Try common article selectors
            const selectors = [
                'article',
                '[data-component="text-block"]', // BBC
                '.article-content',
                '.post-content',
                '.entry-content',
                '.content',
                'main',
                '#main-content',
                '[role="main"]',
                '[role="article"]'
            ];

            // First try to get the article title
            const titleSelectors = [
                'h1',
                '.article-title',
                '.post-title',
                '.entry-title',
                '[itemprop="headline"]'
            ];

            for (const selector of titleSelectors) {
                const element = $(selector).first();
                if (element.length) {
                    title = element.text().trim();
                    break;
                }
            }

            // Then get the main content
            for (const selector of selectors) {
                const element = $(selector);
                if (element.length) {
                    content = element.text().trim();
                    break;
                }
            }

            // If no content found, try paragraphs
            if (!content) {
                content = $('p').map((_, el) => $(el).text().trim()).get().join('\n\n');
            }

            // If still no content, get body text
            if (!content) {
                content = $('body').text().trim();
            }

            // Clean up the content
            content = content
                .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
                .trim();

            if (!content) {
                throw new Error('No content found');
            }

            // Combine title and content if we have a title
            const finalContent = title ? `${title}\n\n${content}` : content;

            return finalContent;
        } catch (error) {
            this.logger.error(`Failed to fetch content from ${url}:`, error);
            throw new Error(`Failed to fetch article content: ${error.message}`);
        }
    }
}