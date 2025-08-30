import React from "react";

const parseValue = (metricName, displayValue) => {
  if (!displayValue) return null;

  if (metricName === "Cumulative Layout Shift") {
    return parseFloat(displayValue);
  }
  if (metricName === "Requests Count") {
    return parseInt(displayValue);
  }
  if (metricName === "Total Byte Weight") {
    return parseInt(displayValue.replace(/[^0-9]/g, ""));
  }

  const cleaned = displayValue.replace(/\s/g, "");

  if (cleaned.endsWith("ms")) {
    return parseFloat(cleaned.replace("ms", ""));
  } else if (cleaned.endsWith("s")) {
    return parseFloat(cleaned.replace("s", "")) * 1000;
  } else {
    return parseFloat(cleaned);
  }
};

const getColorClass = (metricName, displayValue) => {
  const value = parseValue(metricName, displayValue);
  if (value === null || isNaN(value)) return "text-gray-500";

  switch (metricName) {
    case "First Contentful Paint":
    case "Largest Contentful Paint":
    case "Speed Index":
      if (value <= 1800) return "text-green-600";
      if (value <= 3000) return "text-yellow-500";
      return "text-red-600";

    case "Total Blocking Time":
    case "Server Response Time":
      if (value <= 200) return "text-green-600";
      if (value <= 600) return "text-yellow-500";
      return "text-red-600";

    case "Cumulative Layout Shift":
      if (value <= 0.1) return "text-green-600";
      if (value <= 0.25) return "text-yellow-500";
      return "text-red-600";

    case "First Input Delay":
      if (value <= 100) return "text-green-600";
      if (value <= 300) return "text-yellow-500";
      return "text-red-600";

    case "Total Byte Weight":
      if (value <= 500) return "text-green-600";
      if (value <= 1000) return "text-yellow-500";
      return "text-red-600";

    case "Requests Count":
      if (value <= 50) return "text-green-600";
      if (value <= 100) return "text-yellow-500";
      return "text-red-600";

    default:
      return "text-gray-500";
  }
};

const cleanSize = (sizeString) => {
  if (!sizeString) return null;
  const normalized = sizeString.replace(/\u00A0/g, " ");
  const match = normalized.match(/[\d,]+ ?KiB/i);
  return match ? match[0] : sizeString;
};

const cleanTime = (timeString) => {
  if (!timeString) return null;
  const normalized = timeString.replace(/\u00A0/g, " ");
  const match = normalized.match(/[\d.]+ ?ms/i);
  return match ? match[0] : timeString;
};

const isEmptyOrNA = (val) => {
  if (!val) return true;
  const cleaned = val.replace(/\u00A0/g, " ").trim().toLowerCase();
  return cleaned === "n/a" || cleaned === "";
};

const Metrics = ({ data }) => {
  if (!data?.lighthouseResult) return null;

  const audits = data.lighthouseResult.audits;

  const metrics = {
    "First Contentful Paint": audits["first-contentful-paint"]?.displayValue,
    "Largest Contentful Paint": audits["largest-contentful-paint"]?.displayValue,
    "Total Blocking Time": audits["total-blocking-time"]?.displayValue,
    "Cumulative Layout Shift": audits["cumulative-layout-shift"]?.displayValue,
    "Speed Index": audits["speed-index"]?.displayValue,
    "First Input Delay": audits["first-input-delay"]?.displayValue,
    "Total Byte Weight": audits["total-byte-weight"]?.displayValue,
    "Server Response Time": audits["server-response-time"]?.displayValue,
    "Requests Count": audits["network-requests"]?.displayValue,
  };

  return (
    <div className="metrics-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:max-w-3/4 m-auto">
      {Object.entries(metrics).map(([name, value]) => {
        if (isEmptyOrNA(value)) return null;

        if (name === "Total Byte Weight") value = cleanSize(value);
        if (name === "Server Response Time") value = cleanTime(value);

        return (
          <div key={name} className="metric-card p-4 rounded-xl text-center neumorphic">
            <h3 className="font-semibold">{name}</h3>
            <p className={`${getColorClass(name, value)} text-xl mt-2`}>{value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Metrics;
