## Crawl System Component Design

### 1. High-Level Architecture

The crawl system component will be responsible for fetching web page content, executing JavaScript (if necessary), and extracting structured data based on predefined selectors. It will integrate with the existing `CrawlSource` and `CrawlTargetField` models.

**Components:**

*   **Crawl Orchestrator:** Manages the crawling tasks, dispatches requests, and handles scheduling. (This is a higher-level component, but important for context).
*   **Page Fetcher (Puppeteer-based):** Uses Puppeteer to navigate to URLs, wait for page load, and render JavaScript.
*   **Selector Engine:** Applies CSS or XPath selectors to the fetched page content.
*   **Data Extractor:** Extracts data based on the applied selectors and the specified attributes.
*   **Validation Module:** Performs real-time validation of selectors during configuration and potentially during the crawl process.
*   **Error Handler:** Manages network errors, page load failures, and anti-bot measures.

### 2. Puppeteer Integration

Puppeteer will be the core of the Page Fetcher. It will be used in a headless mode for efficiency. Key functionalities include:

*   **Page Navigation:** `page.goto(url, { waitUntil: 'networkidle2' })` to ensure all network requests are settled.
*   **Dynamic Content Handling:** `page.waitForSelector(selector)` or `page.waitForFunction(function)` to wait for specific elements or conditions to appear after JavaScript execution.
*   **Screenshot/PDF Generation (Optional):** For debugging or archiving purposes.
*   **Proxy Support:** To bypass IP-based blocking.
*   **User-Agent Rotation:** To mimic different browsers and avoid detection.
*   **Resource Blocking:** To block unnecessary resources (images, CSS) to speed up crawling and save bandwidth.

### 3. Selector Validation

The existing `SelectorValidationController` provides a basic mechanism for validating selectors. This will be enhanced to leverage Puppeteer's capabilities for more accurate validation, especially for dynamic content.

*   **Real-time Validation:** When a user enters a selector in the admin panel, the system will launch a headless Puppeteer instance, navigate to the specified URL, and attempt to find the element using the provided selector.
*   **Content Extraction:** If the element is found, its `innerText` or a specified attribute (e.g., `href`, `src`) will be extracted and returned to the user for verification.
*   **Error Reporting:** If the selector does not match any element or if there are issues fetching the page, clear error messages will be provided.
*   **Visual Feedback (Optional):** For advanced debugging, a screenshot of the page with the selected element highlighted could be generated.

### 4. Data Extraction

Once selectors are validated and stored as `CrawlTargetField` entries, the crawl system will use them to extract data during the actual crawling process.

*   **Iterative Extraction:** For each `CrawlSource`, the Page Fetcher will navigate to the `source_url`.
*   **Selector Application:** For each `CrawlTargetField` associated with the `CrawlSource`, the Selector Engine will apply the `selector_value` (CSS or XPath) to the page content.
*   **Attribute Handling:** If an `attribute` is specified in `CrawlTargetField`, the value of that attribute will be extracted; otherwise, the `innerText` of the element will be extracted.
*   **Data Structuring:** The extracted data for all target fields will be structured (e.g., as a JSON object) and passed to the next stage of the pipeline (e.g., Processing Service).
*   **Handling Multiple Matches:** If a selector matches multiple elements, a strategy will be needed (e.g., extract all, extract first, concatenate). The current design implies extracting the first match (`->first()` in `SelectorValidationController`), but this might need to be configurable for different `CrawlTargetField` types.

### 5. Error Handling & Robustness

A robust crawl system must anticipate and gracefully handle various issues that can arise during web scraping.

*   **Network Errors:** Implement retries with exponential backoff for transient network failures (e.g., DNS resolution errors, connection timeouts).
*   **Page Load Failures:** Handle cases where pages fail to load completely or return non-200 status codes. This might involve retries, skipping the page, or logging the error for manual review.
*   **Anti-bot Measures:**
    *   **CAPTCHA/ReCAPTCHA:** Implement mechanisms to detect and potentially solve CAPTCHAs (e.g., integration with CAPTCHA solving services, though this adds cost and complexity).
    *   **IP Blocking:** Utilize proxy rotation to distribute requests across multiple IP addresses.
    *   **User-Agent Blocking:** Rotate User-Agents to mimic different browsers and devices.
    *   **Rate Limiting:** Implement delays between requests to avoid overwhelming target servers and triggering rate limits.
*   **Selector Failures:** If a selector fails to find an element, log the error and potentially mark the `CrawlTargetField` as problematic for manual review.
*   **Data Validation:** After extraction, validate the data against expected formats or types to catch malformed or unexpected content.

### Summary of Design

The proposed crawl system component leverages Puppeteer for robust page fetching and JavaScript rendering, enabling the extraction of data from dynamic web pages. The selector validation process is enhanced to provide real-time feedback and improve accuracy. The system incorporates comprehensive error handling and anti-bot measures to ensure reliability and resilience during large-scale crawling operations. This design provides a solid foundation for building a scalable and effective web crawling solution for Semoi.
