# Semoi Crawl System Usage Guide

## Selector Validator Usage

The Selector Validator is a powerful tool integrated into the Crawl Source creation and editing pages. It allows you to test your CSS Selectors or XPath expressions in real-time against a target URL to ensure they correctly extract the desired content.

### How to Use the Selector Validator

1.  **Navigate to Crawl Source Page:**
    *   Go to the Admin Dashboard (`/admin`).
    *   Click on "Crawl Sources" in the sidebar.
    *   Either click "Add New Source" to create a new crawl source, or click "Edit" next to an existing source.

2.  **Locate the Selector Validator Section:**
    *   Scroll down to the "Selector Validator" section on the page.

3.  **Fill in the Details:**
    *   **Source URL:** Enter the full URL of the webpage you want to test. This should be the exact page from which you intend to extract data.
        *   *Example:* `https://www.onoffmix.com/event/main/it`
    *   **Selector Type:** Select either `CSS Selector` or `XPath` from the dropdown menu, depending on the type of selector you are using.
    *   **Selector Value:** Enter your CSS Selector or XPath expression.
        *   *CSS Selector Example:* `h1.event-title` (to select an `<h1>` tag with class `event-title`)
        *   *XPath Example:* `//span[@class='price']` (to select a `<span>` tag with class `price` anywhere on the page)

4.  **Test the Selector:**
    *   Click the **"Test"** button.

5.  **Review the Results:**
    *   The "validator-result" area below the button will display the extracted content. If the selector is correct and finds content, you will see the text extracted by your selector.
    *   If there is an error (e.g., invalid URL, selector not found, network issue), an error message will be displayed.

### Tips for Effective Validation

*   **Start Simple:** Begin with broad selectors and gradually refine them.
*   **Inspect Element:** Use your browser's developer tools (usually F12) to inspect the elements on the target webpage and get accurate CSS selectors or XPath expressions.
*   **Test Edge Cases:** Try different URLs from the same source to ensure your selectors are robust.
*   **Dynamic Content:** For pages that load content dynamically with JavaScript, Puppeteer will render the page before applying the selector, providing more accurate results than simple HTTP requests.
