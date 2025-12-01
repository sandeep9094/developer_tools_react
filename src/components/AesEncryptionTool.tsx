import React, { useState } from "react";
import "./AesEncryptionTool.css";

type AesMode = "encrypt" | "decrypt";

const AesEncryptionTool: React.FC = () => {
  const [mode, setMode] = useState<AesMode>("encrypt");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  const generateRandomBytes = (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  };

  const deriveKey = async (passwordText: string, salt: Uint8Array) => {
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      textEncoder.encode(passwordText),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100_000,
        hash: "SHA-256",
      },
      passwordKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const concatBytes = (arrays: Uint8Array[]): Uint8Array => {
    const totalLength = arrays.reduce((sum, a) => sum + a.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  };

  const toBase64 = (bytes: Uint8Array): string => {
    if (bytes.length === 0) return "";
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  };

  const fromBase64 = (base64: string): Uint8Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const encrypt = async (plainText: string, pass: string): Promise<string> => {
    const salt = generateRandomBytes(16); // 128-bit salt
    const iv = generateRandomBytes(12); // 96-bit IV for AES-GCM
    const key = await deriveKey(pass, salt);

    const cipherBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      textEncoder.encode(plainText)
    );

    const cipherBytes = new Uint8Array(cipherBuffer);
    // [salt(16)][iv(12)][ciphertext(...)]
    const combined = concatBytes([salt, iv, cipherBytes]);
    return toBase64(combined);
  };

  const decrypt = async (cipherBase64: string, pass: string): Promise<string> => {
    const combined = fromBase64(cipherBase64.trim());
    if (combined.length < 16 + 12) {
      throw new Error("Ciphertext is too short or invalid");
    }

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await deriveKey(pass, salt);

    const plainBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      ciphertext
    );

    return textDecoder.decode(plainBuffer);
  };

  const handleProcess = async () => {
    if (!input.trim() || !password.trim()) {
      setOutput("");
      setError("Both input and password are required.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      if (mode === "encrypt") {
        const cipher = await encrypt(input, password);
        setOutput(cipher);
      } else {
        const plain = await decrypt(input, password);
        setOutput(plain);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error while processing AES encryption/decryption";
      setError(
        mode === "encrypt"
          ? "Error encrypting: " + message
          : "Error decrypting: " + message + ". Check your password and input."
      );
      setOutput("");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setPassword("");
    setOutput("");
    setError(null);
  };

  const copyOutput = () => {
    if (output) {
      void navigator.clipboard.writeText(output);
    }
  };

  const canProcess = input.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="aes-container">
      <div className="aes-card">
        <div className="aes-header">
          <div>
            <h1 className="aes-title">AES Encryption Tool</h1>
            <p className="aes-subtitle">
              Encrypt and decrypt text with AES‑256‑GCM using a password. Output is URL‑safe Base64.
            </p>
          </div>
          <div className="aes-header-actions">
            <button className="aes-btn-secondary" onClick={clearAll}>
              Clear
            </button>
            <button
              className="aes-btn-primary"
              onClick={handleProcess}
              disabled={!canProcess || isProcessing}
            >
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </button>
          </div>
        </div>

        <div className="aes-controls">
          <div className="aes-mode-selector">
            <label className="aes-label" htmlFor="aes-mode">
              Mode
            </label>
            <select
              id="aes-mode"
              className="aes-select"
              value={mode}
              onChange={(e) => setMode(e.target.value as AesMode)}
            >
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>

          <div className="aes-password-wrapper">
            <label className="aes-label" htmlFor="aes-password">
              Password
            </label>
            <input
              id="aes-password"
              type="password"
              className="aes-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password..."
            />
          </div>

          <div className="aes-meta">
            <div>
              <span className="aes-meta-label">Input Length:</span>
              <span className="aes-meta-value">{input.length} chars</span>
            </div>
            <div>
              <span className="aes-meta-label">Output Length:</span>
              <span className="aes-meta-value">{output.length} chars</span>
            </div>
          </div>
        </div>

        <div className="aes-grid">
          <div className="aes-section">
            <div className="aes-input-header">
              <label htmlFor="aes-input" className="aes-label">
                {mode === "encrypt" ? "Plaintext Input" : "Ciphertext Input (Base64)"}
              </label>
            </div>
            <textarea
              id="aes-input"
              className="aes-textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder={
                mode === "encrypt"
                  ? "Enter text to encrypt..."
                  : "Paste Base64 cipher produced by this tool..."
              }
              rows={12}
            />
          </div>

          <div className="aes-section">
            <div className="aes-output-header">
              <label htmlFor="aes-output" className="aes-label">
                {mode === "encrypt" ? "Ciphertext (Base64)" : "Decrypted Plaintext"}
              </label>
              <button
                className="copy-button"
                disabled={!output}
                onClick={copyOutput}
                title="Copy output"
              >
                📋 Copy
              </button>
            </div>
            <textarea
              id="aes-output"
              className="aes-textarea"
              value={output}
              readOnly
              placeholder={mode === "encrypt" ? "Encrypted output will appear here..." : "Decrypted text will appear here..."}
              rows={12}
            />
            {isProcessing && (
              <div className="aes-status">
                {mode === "encrypt" ? "Encrypting..." : "Decrypting..."}
              </div>
            )}
          </div>
        </div>

        {error && <div className="aes-error">{error}</div>}

        <div className="aes-info">
          <p>
            <strong>How it works:</strong> This tool uses PBKDF2 with 100,000 iterations and SHA-256 to
            derive an AES‑256‑GCM key from your password. A random 16‑byte salt and 12‑byte IV are
            generated for each encryption and bundled with the ciphertext.
          </p>
          <p>
            To successfully decrypt, you must use the <strong>same password</strong> and the original
            Base64 output produced by this tool.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AesEncryptionTool;


