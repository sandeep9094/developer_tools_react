import React, { useEffect, useState } from "react";
import "./RegexMatcher.css";

const presets = {
  email: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  phone: "^\\d{10}$",
  url: "https?:\\/\\/[^\\s]+",
};

const RegexMatcher: React.FC = () => {
  const [pattern, setPattern] = useState(presets.email);
  const [flags, setFlags] = useState("gm");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [regex, setRegex] = useState<RegExp | null>(null);
  const [matches, setMatches] = useState<string[]>([]);

  // Compile regex safely
  useEffect(() => {
    try {
      const r = new RegExp(pattern, flags);
      setRegex(r);
      setError(null);
    } catch {
      setError("Invalid Regular Expression");
      setRegex(null);
    }
  }, [pattern, flags]);

  // Extract matches safely
  useEffect(() => {
    if (!regex || !testString) {
      setMatches([]);
      return;
    }

    const out: string[] = [];
    const lines = testString.split(/\n/);

    for (const line of lines) {
      const r = new RegExp(regex.source, flags);
      let m;
      while ((m = r.exec(line)) !== null) {
        out.push(m[0]);
        if (!r.global) break;
      }
    }

    setMatches(out);
  }, [regex, testString, flags]);

  return (
    <div className="regex-container">
      <div className="regex-card">
        {/* HEADER */}
        <div className="regex-header">
          <div>
            <h1 className="regex-title">Regex Matcher</h1>
            <p className="regex-subtitle">
              Test regular expressions with live match preview. Supports multiline input and flags.
            </p>
          </div>

          <div className="regex-presets">
            <button className="regex-preset-btn" onClick={() => setPattern(presets.email)}>Email</button>
            <button className="regex-preset-btn" onClick={() => setPattern(presets.phone)}>Phone</button>
            <button className="regex-preset-btn" onClick={() => setPattern(presets.url)}>URL</button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="regex-grid">
          {/* LEFT CARD */}
          <div className="regex-section">
            <label className="regex-label">Regex Pattern</label>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="regex-input"
              placeholder="Enter regex here..."
            />

            <label className="regex-label mt-3">Flags</label>
            <input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="regex-input"
              placeholder="gm"
            />

            {error && <div className="regex-error">{error}</div>}
          </div>

          {/* RIGHT CARD */}
          <div className="regex-section">
            <label className="regex-label">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="regex-textarea large-textarea"
              placeholder="Paste or type test input here..."
            />
          </div>
        </div>

        {/* RESULTS */}
        <div className="regex-results">
          <h2 className="regex-results-title">Matched Results</h2>

          <ul className="regex-results-list">
            {matches.length === 0 ? (
              <li className="regex-no-match">No matches found</li>
            ) : (
              matches.map((m, i) => <li key={i}>{m}</li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegexMatcher;
