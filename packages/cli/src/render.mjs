export const renderHtml = async (target, options = {}) => {
  if (options.renderer) {
    const html = await options.renderer({ target, html: options.html, finalUrl: options.finalUrl });
    return { status: "rendered", html };
  }

  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: options.viewport || { width: 390, height: 844 },
      userAgent: "OpenClaw GEO SEO audit renderer",
    });
    if (/^https?:\/\//i.test(target)) {
      await page.goto(target, { waitUntil: "networkidle", timeout: options.timeout || 30000 });
    } else {
      await page.setContent(options.html || "", { waitUntil: "networkidle", timeout: options.timeout || 30000 });
    }
    const html = await page.content();
    await browser.close();
    return { status: "rendered", html };
  } catch (error) {
    return { status: "unavailable", reason: error.message };
  }
};
