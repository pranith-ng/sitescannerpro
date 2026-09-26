"use client"

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { motion } from "framer-motion";

const AIStr = ({ data }) => {

    const { aiprompt, setaiprompt } = useContext(AppContext)
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!data?.lighthouseResult) return null;

    const { lighthouseResult } = data;

    // Get category scores as simple text
    const categoryScores = Object.entries(lighthouseResult.categories)
        .map(([name, category]) => `${name}: ${Math.round(category.score * 100)}%`)
        .join("\n");

    // List of important metrics to show
    const keyMetrics = [
        "first-contentful-paint",
        "largest-contentful-paint",
        "speed-index",
        "total-blocking-time",
        "cumulative-layout-shift",
    ];

    // Get metric values as text
    const metrics = keyMetrics
        .map((id) => {
            const audit = lighthouseResult.audits[id];
            if (!audit) return null;
            return `${audit.title}: ${audit.displayValue || audit.numericValue || "N/A"}`;
        })
        .filter(Boolean)
        .join("\n");

    // Limit text length for descriptions
    const shorten = (text, max = 100) => (text.length > max ? text.slice(0, max) + "..." : text);

    // Get top 5 opportunities (suggestions)
    const opportunities = Object.values(lighthouseResult.audits)
        .filter((audit) => audit.details?.type === "opportunity")
        .sort((a, b) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0))
        .slice(0, 5)
        .map((audit) => `- ${audit.title}: ${shorten(audit.description)}`)
        .join("\n");

    // Get top 5 diagnostics (problems, not opportunities)
    const diagnostics = Object.values(lighthouseResult.audits)
        .filter(
            (audit) =>
                audit.score !== 1 &&
                audit.details?.type !== "opportunity" &&
                audit.title &&
                audit.description
        )
        .slice(0, 5)
        .map((audit) => `- ${audit.title}: ${shorten(audit.description)}`)
        .join("\n");

    // Final text to send to AI
    const aiInput = `
Category Scores:
${categoryScores}

Key Metrics:
${metrics}

Top Opportunities:
${opportunities || "None"}

Top Diagnostics:
${diagnostics || "None"}
`;

    const promptInput = `
Analyze the Lighthouse report below and create a concise website audit.

You have four categories:
Performance
Accessibility
Best Practices
SEO

Your job is to find real problems from the Lighthouse report and explain how to fix them.

IMPORTANT:
- Only use information that actually exists in the Lighthouse JSON.
- Never invent problems, metrics, scores, or recommendations.
- Only report an issue when the Lighthouse data provides evidence for it.
- Passing audits are NOT problems.
- Do not repeat the same problem.
- Do not create problems just to increase the number of results.
- Use the exact values from the report when mentioning scores or metrics.
- Keep problems short and practical.
- Prefer important failed audits, opportunities, and diagnostics.

OUTPUT FORMAT:

You MUST use exactly these four headings, in exactly this order:

## Performance

[Performance issues OR the sentence below]

## Accessibility

[Accessibility issues OR the sentence below]

## Best Practices

[Best Practices issues OR the sentence below]

## SEO

[SEO issues OR the sentence below]

UNDER EACH HEADING:

If there are real issues in that category, write them like this:

- Problem: [short description of the actual issue]
  Fix: [short actionable solution]

You may include multiple problems when the report contains multiple real issues.

If there are NO real issues in that category, write exactly:

No significant issues identified. Your website is fine in this area and no improvements are needed.

VERY IMPORTANT:
Never leave a category empty.

For example, this is WRONG:

## Accessibility

## Best Practices

## SEO

Instead, if those categories have no issues, write:

## Accessibility

No significant issues identified. Your website is fine in this area and no improvements are needed.

## Best Practices

No significant issues identified. Your website is fine in this area and no improvements are needed.

## SEO

No significant issues identified. Your website is fine in this area and no improvements are needed.

CATEGORY SCORES:

Use category scores as context when deciding whether an issue is significant, but DO NOT put scores in the headings.

Do NOT write:

## Performance (Score: 97%)

Write:

## Performance

If a score is relevant to explaining a problem, you may mention it inside the problem.

NUMBER OF PROBLEMS:

Find as many genuine issues as the report provides.

Ideally return 15–20 issues when the report actually contains that many.

If the report contains only 5 genuine issues, return only 5.

If the report contains 2 genuine issues, return only 2.

Never invent additional issues to reach 15–20.

BALANCE:

Do not put every issue under Performance.

Place each issue under the category it belongs to according to the Lighthouse report.

If Accessibility, Best Practices, or SEO have no issues, use the "No significant issues identified..." sentence for that category.

METRICS:

When an issue contains a useful metric, use the exact value from the report.

For example:

- Problem: Largest Contentful Paint is 3,200 ms.
  Fix: Optimize the LCP resource and reduce render-blocking resources.

Do not calculate or invent metrics.

STYLE:

Keep everything concise.

Do not add an introduction.
Do not add a conclusion.
Do not add a summary.
Do not add extra headings.
Do not add scores to headings.
Do not use bold headings.
Do not output JSON.

Return the audit using the exact four-heading structure above.

LIGHTHOUSE REPORT:

${aiInput}
`;


    useEffect(() => {
        setaiprompt(promptInput)
    }, [])

    const returnaidata = async (e) => {
        setLoading(true)
        setError(null)
        setReply("")

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: promptInput }),
            })
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "something went wrong");
            }
            const data = await res.json()
            setReply(data.reply)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false)
        }

    }


    function convertReportToHTML(text) {
        const lines = text.split("\n");
        let html = "";
        let openList = false;

        for (let line of lines) {
            line = line.trim();

            if (!line) continue;

            if (line.startsWith("##")) {
                if (openList) {
                    html += "</ul>";
                    openList = false;
                }

                const category = line.replace("##", "").trim();

                html += `<h2 style="font-size:20px;font-weight:bold;color:#333;margin-top:20px;">${category}</h2>`;

            } else if (line.startsWith("- Problem:")) {
                if (!openList) {
                    html += "<ul>";
                    openList = true;
                }

                const problemText = line.replace("- Problem:", "").trim();

                html += `<li><span style="color:red;font-weight:bold;">Problem:</span> ${problemText}<br>`;

            } else if (line.startsWith("Fix:")) {
                const fixText = line.replace("Fix:", "").trim();

                html += `<span style="color:green;font-weight:bold;">Fix:</span> ${fixText}</li>`;

            } else if (
                line ===
                "No significant issues identified. Your website is fine in this area and no improvements are needed."
            ) {
                html += `<p style="margin-top:10px;color:green;font-weight:bold">${line}</p>`;
            }
        }

        if (openList) {
            html += "</ul>";
        }

        return html;
    }


    return (
        <>
            <div className="my-12 text-center">
                <button
                    disabled={loading}
                    className="py-4 px-6 rounded-4xl"
                    onClick={returnaidata}>

                    {loading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-7 h-7 border-black border-4 border-t-transparent rounded-full"
                        />
                    ) : (
                        "Ai reply"
                    )}

                </button>
            </div>

            {
                reply ?
                    <div className="neumorphic my-6 whitespace-pre-wrap p-4 rounded-lg md:max-w-3/4 m-auto">

                        <div
                            dangerouslySetInnerHTML={{ __html: convertReportToHTML(reply) }} />
                    </div>
                    :

                    <p className={`text-center ${error ? "text-red-500 font-bold" : ""}`}>
                        {error
                            ? "API Server has some problem. Try again after sometime."
                            : "Click the above button to get AI recommendation"}
                    </p>

            }



        </>

    );
};

export default AIStr;
