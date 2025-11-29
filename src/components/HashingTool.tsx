import React, { useState, useEffect } from "react";
import "./HashingTool.css";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512" | "SHA-384";

const HashingTool: React.FC = () => {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);

  // MD5 implementation using a simple hash function
  // Note: Web Crypto API doesn't support MD5 natively
  // For production MD5, install crypto-js: npm install crypto-js
  // Then: import CryptoJS from 'crypto-js'; return CryptoJS.MD5(message).toString();
  const md5 = async (message: string): Promise<string> => {
    // Simple hash function as fallback (not true MD5)
    // This is a placeholder - for real MD5, use crypto-js library
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data[i];
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to hex and pad to 32 characters (MD5 length)
    return Math.abs(hash).toString(16).padStart(32, '0');
  };

  // Hash using Web Crypto API
  const hashWithCrypto = async (message: string, algo: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    let algorithm: string;
    switch (algo) {
      case "SHA-1":
        algorithm = "SHA-1";
        break;
      case "SHA-256":
        algorithm = "SHA-256";
        break;
      case "SHA-384":
        algorithm = "SHA-384";
        break;
      case "SHA-512":
        algorithm = "SHA-512";
        break;
      default:
        algorithm = "SHA-256";
    }

    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  // Generate hash
  const generateHash = async () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      setIsHashing(true);
      setError(null);
      let hash: string;

      if (algorithm === "MD5") {
        // MD5 is not natively supported by Web Crypto API
        // This is a simple hash function - for true MD5, install crypto-js
        hash = await md5(input);
        setError("Note: This is a simple hash function, not true MD5. For production MD5, install crypto-js: npm install crypto-js");
      } else {
        hash = await hashWithCrypto(input, algorithm);
      }

      setOutput(hash);
    } catch (err) {
      setError("Error generating hash: " + (err instanceof Error ? err.message : "Unknown error"));
      setOutput("");
    } finally {
      setIsHashing(false);
    }
  };

  // Auto-hash on input or algorithm change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        generateHash();
      } else {
        setOutput("");
        setError(null);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [input, algorithm]);

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleGenerateClick = () => {
    void generateHash();
  };

  return (
    <div className="hashing-container">
      <div className="hashing-card">
        <div className="hashing-header">
          <div>
            <h1 className="hashing-title">Hash Generator</h1>
            <p className="hashing-subtitle">
              Generate cryptographic hashes using MD5, SHA-1, SHA-256, SHA-384, or SHA-512 algorithms.
            </p>
          </div>
          <div className="hashing-header-actions">
            <button className="hashing-btn-secondary" onClick={clearAll}>
              Clear
            </button>
            <button className="hashing-btn-primary" onClick={handleGenerateClick} disabled={!input.trim()}>
              Hash Now
            </button>
          </div>
        </div>

        <div className="hashing-controls">
          <div className="hashing-algorithm-selector">
            <label htmlFor="algorithm" className="hashing-label">
              Hash Algorithm
            </label>
            <select
              id="algorithm"
              className="hashing-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
            >
              <option value="MD5">MD5</option>
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
          <div className="hashing-meta">
            <div>
              <span className="hashing-meta-label">Input Length:</span>
              <span className="hashing-meta-value">{input.length} chars</span>
            </div>
            <div>
              <span className="hashing-meta-label">Hash Length:</span>
              <span className="hashing-meta-value">{output.length} chars</span>
            </div>
          </div>
        </div>

        <div className="hashing-grid">
          <div className="hashing-section">
            <label htmlFor="input" className="hashing-label">Input Text</label>
            <div className="hashing-textarea-wrapper">
              <textarea
                id="input"
                className="hashing-textarea"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter text to hash..."
                rows={12}
              />
            </div>
          </div>

          <div className="hashing-section">
            <label htmlFor="output" className="hashing-label">Hash Output</label>
            <div className="hashing-textarea-wrapper">
              <textarea
                id="output"
                className="hashing-textarea"
                value={output}
                readOnly
                placeholder="Hash will appear here..."
                rows={12}
              />
              <button
                className="hashing-btn-copy"
                disabled={!output}
                onClick={copyOutput}
                aria-label="Copy hash output"
              >
                Copy
              </button>
            </div>
            {isHashing && (
              <div className="hashing-status">Generating hash...</div>
            )}
          </div>
        </div>

        {error && (
          <div className="hashing-error">
            {error}
          </div>
        )}

        <div className="hashing-info">
          <p>
            <strong>Algorithm Info:</strong>{" "}
            {algorithm === "MD5" && "MD5 produces a 128-bit (32 hex characters) hash. Note: MD5 is cryptographically broken and should not be used for security purposes."}
            {algorithm === "SHA-1" && "SHA-1 produces a 160-bit (40 hex characters) hash. Note: SHA-1 is deprecated for security purposes."}
            {algorithm === "SHA-256" && "SHA-256 produces a 256-bit (64 hex characters) hash. Recommended for most use cases."}
            {algorithm === "SHA-384" && "SHA-384 produces a 384-bit (96 hex characters) hash."}
            {algorithm === "SHA-512" && "SHA-512 produces a 512-bit (128 hex characters) hash."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HashingTool;

