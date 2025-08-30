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
You are given a Lighthouse report in JSON format.

Summarize the main issues into **categories**: 
Performance, Accessibility, SEO, Best Practices,.

For each category:
- Include at least 2–4 problems from that category, drawing from Opportunities, Diagnostics, or audits.
- Each problem should be short and actionable, with a fix.
- Use this format:

### [Category Name]

- Problem: [short issue]
  Fix: [short solution]

Rules:
- Focus on category scores and key metrics. When summarizing, reference category scores and metrics directly (e.g., Performance 45, Accessibility 72). Do not generalize — always include the numeric values from the report.
- Do not give all points under Performance only. Balance them across categories.
- Include both major issues and smaller ones (opportunities + diagnostics).
- Keep wording concise and practical.
- Final output should contain atleast 15-20 problems total if available but dont assume anything, spread across the categories.
- Do not assume anything that is not present in the report. If the information is missing, say nothing skip


Report:
${aiInput}
`

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
            console.log(data.reply)
            console.log(aiInput)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false)
        }

    }

    console.log(aiInput)

    function convertReportToHTML(text) {
        const lines = text.split("\n");
        let html = "";
        let openList = false;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue; // skip empty lines

            if (line.startsWith("###")) {
                if (openList) {
                    html += "</ul>";
                    openList = false;
                }
                const category = line.replace("###", "").trim();
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
            }
        }

        if (openList) html += "</ul>"; // close last list
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
                    <p className="text-center">click the above button to get ai recommendation</p>
            }



        </>

    );
};

export default AIStr;
