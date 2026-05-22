export const renderHtml = async (target, options = {}) => {
  if (options.security?.mode === "restricted" && /^https?:\/\//i.test(target)) {
    return {
      status: "unavailable",
      reason: "Restricted security mode disables browser rendering for URL targets.",
    };
  }

  if (options.renderer) {
    const html = await options.renderer({ target, html: options.html, finalUrl: options.finalUrl });
    return { status: "rendered", html };
  }

  let browser;
  let error;
  let result;

  try {
    const launcher = options.launcher || (await import("playwright")).chromium;
    browser = await launcher.launch({ headless: true });
    const page = await browser.newPage({
      viewport: options.viewport || { width: 390, height: 844 },
      userAgent: "RankForge GEO SEO audit renderer",
    });
    if (/^https?:\/\//i.test(target)) {
      await page.goto(target, { waitUntil: "networkidle", timeout: options.timeout || 30000 });
    } else {
      await page.setContent(options.html || "", { waitUntil: "networkidle", timeout: options.timeout || 30000 });
    }
    const html = await page.content();
    result = { status: "rendered", html };
  } catch (caughtError) {
    error = caughtError;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        error ||= closeError;
      }
    }
  }

  return error ? { status: "unavailable", reason: error.message } : result;
};
