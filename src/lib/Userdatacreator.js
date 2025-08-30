export function extractLighthouseSummary(data, html) {
  const categories = data?.lighthouseResult?.categories || {};
  const audits = data?.lighthouseResult?.audits || {};

  const summary = {
    scores: {
      performance: categories.performance?.score ?? null,
      accessibility: categories.accessibility?.score ?? null,
      best_practices: categories["best-practices"]?.score ?? null,
      seo: categories.seo?.score ?? null,
    },
    metrics: {
      first_contentful_paint: audits["first-contentful-paint"]?.numericValue ?? null,
      largest_contentful_paint: audits["largest-contentful-paint"]?.numericValue ?? null,
      total_blocking_time: audits["total-blocking-time"]?.numericValue ?? null,
      cumulative_layout_shift: audits["cumulative-layout-shift"]?.numericValue ?? null,
      speed_index: audits["speed-index"]?.numericValue ?? null,
    }
  };

  // ✅ If an HTML string/variable is provided, add it
  if (html) {
    summary.html = html;
  }

  return summary;
}
