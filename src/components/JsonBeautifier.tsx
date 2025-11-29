import React, { useState } from "react";
import "./JsonBeautifier.css";

const JsonBeautifier: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const beautifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const beautified = JSON.stringify(parsed, null, 2);
      setOutput(beautified);
      setError(null);
    } catch {
      setError("Invalid JSON syntax");
      setOutput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pairs: Record<string, string> = {
      "{": "}",
      "[": "]",
      "(": ")",
      '"': '"',
    };

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (pairs[e.key]) {
      e.preventDefault();
      const open = e.key;
      const close = pairs[e.key];
      const newValue =
        input.slice(0, start) + open + close + input.slice(end);
      setInput(newValue);

      setTimeout(() => {
        textarea.setSelectionRange(start + 1, start + 1);
      }, 0);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="json-container">
      <div className="json-card">

        {/* TITLE */}
        <div className="json-header">
          <div>
            <h1 className="json-title">JSON Beautifier</h1>
            <p className="json-subtitle">
              Format, validate and auto-fix common indentation issues. Light/Dark
              mode supported.
            </p>
          </div>

          <div className="json-header-buttons">
            <button className="json-btn json-btn-format" onClick={beautifyJson}>
              Beautify
            </button>
            <button className="json-btn json-btn-reset" onClick={clearAll}>
              Reset
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="json-grid">
          {/* INPUT */}
          <div className="json-section">
            <label className="json-label">Input JSON</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste or type JSON here..."
              className="json-textarea large-textarea"
            />
          </div>

          {/* OUTPUT */}
          <div className="json-section">
            <div className="json-output-header">
              <label className="json-label">Formatted Output</label>
              <button
                className="copy-button"
                disabled={!output}
                onClick={copyOutput}
                title="Copy formatted JSON"
              >
                📋 Copy
              </button>
            </div>

            <textarea
              value={output}
              readOnly
              className="json-textarea large-textarea"
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="json-status">
          <span className={error ? "json-status-error" : ""}>
            {error ?? "Ready"}
          </span>
          <span>{input.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default JsonBeautifier;
