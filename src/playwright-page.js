const { chromium } = require('playwright');

// Custom function to overload a page
function overloadPage(page) {
    page.customVariable = 'Your Custom Value';
}

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    // Create a context hook to run before new pages are created
    context.addInitScript(overloadPage);

    const page = await context.newPage();

    // Access the custom variable on the page
    console.log(page.customVariable); // 'Your Custom Value'

    // Continue with your automation
    await page.goto('https://example.com');

    await browser.close();
})();
