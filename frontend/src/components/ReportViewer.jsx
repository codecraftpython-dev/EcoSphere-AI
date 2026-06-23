import React from 'react';

/**
 * Custom lightweight Markdown parser to avoid external dependencies.
 * Converts headings, bold texts, lists, and newlines to styled HTML.
 */
function parseMarkdown(mdText) {
  if (!mdText) return "";

  const lines = mdText.split('\n');
  const parsed = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Check lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        parsed.push('<ul class="report-list">');
        inList = true;
      }
      let content = line.substring(2);
      // Replace bold tags
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
      parsed.push(`<li>${content}</li>`);
      continue;
    } else {
      if (inList) {
        parsed.push('</ul>');
        inList = false;
      }
    }

    // Check headers
    if (line.startsWith('# ')) {
      parsed.push(`<h1>${line.substring(2)}</h1>`);
    } else if (line.startsWith('## ')) {
      parsed.push(`<h2>${line.substring(3)}</h2>`);
    } else if (line.startsWith('### ')) {
      parsed.push(`<h3>${line.substring(4)}</h3>`);
    } else if (line === "") {
      // Empty line, ignore or add small separator
    } else {
      // Standard paragraph
      let content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
      parsed.push(`<p>${content}</p>`);
    }
  }

  if (inList) {
    parsed.push('</ul>');
  }

  return parsed.join('\n');
}

export default function ReportViewer({ report }) {
  if (!report) return null;

  const htmlContent = parseMarkdown(report);

  return (
    <div className="report-markdown" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
