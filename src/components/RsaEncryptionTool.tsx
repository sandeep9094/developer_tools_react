import React, { useState } from "react";
import "./RsaEncryptionTool.css";

type RsaMode = "encrypt" | "decrypt";

const RsaEncryptionTool: React.FC = () => {
  const [mode, setMode] = useState<RsaMode>("encrypt");
  const [input, setInput] = useState("");
  const [publicKeyPem, setPublicKeyPem] = useState("");
  const [privateKeyPem, setPrivateKeyPem] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const wrapPem = (base64: string, type: "PUBLIC KEY" | "PRIVATE KEY") => {
    const wrapped = base64.replace(/(.{64})/g, "$1\n");
    return `-----BEGIN ${type}-----\n${wrapped}\n-----END ${type}-----`;
  };

  const unwrapPem = (pem: string) => {
    return pem.replace(/-----BEGIN [^-]+-----/, "")
      .replace(/-----END [^-]+-----/, "")
      .replace(/\s+/g, "");
  };

  const generateKeyPair = async () => {
    try {
      setIsGeneratingKeys(true);
      setError(null);

      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      const spki = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const pubBase64 = arrayBufferToBase64(spki);
      const privBase64 = arrayBufferToBase64(pkcs8);

      setPublicKeyPem(wrapPem(pubBase64, "PUBLIC KEY"));
      setPrivateKeyPem(wrapPem(privBase64, "PRIVATE KEY"));
      setError(null);
    } catch (err) {
      setError(
        "Error generating RSA key pair: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const importPublicKey = async (pem: string): Promise<CryptoKey> => {
    const base64 = unwrapPem(pem);
    const binaryDer = base64ToArrayBuffer(base64);
    return crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
  };

  const importPrivateKey = async (pem: string): Promise<CryptoKey> => {
    const base64 = unwrapPem(pem);
    const binaryDer = base64ToArrayBuffer(base64);
    return crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );
  };

  const encrypt = async (plainText: string, pemPublic: string): Promise<string> => {
    const publicKey = await importPublicKey(pemPublic);
    const cipherBuffer = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      textEncoder.encode(plainText)
    );
    return arrayBufferToBase64(cipherBuffer);
  };

  const decrypt = async (cipherBase64: string, pemPrivate: string): Promise<string> => {
    const privateKey = await importPrivateKey(pemPrivate);
    const cipherBuffer = base64ToArrayBuffer(cipherBase64.trim());
    const plainBuffer = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      cipherBuffer
    );
    return textDecoder.decode(plainBuffer);
  };

  const handleProcess = async () => {
    if (!input.trim()) {
      setOutput("");
      setError("Input is required.");
      return;
    }

    if (mode === "encrypt" && !publicKeyPem.trim()) {
      setError("Public key is required for encryption.");
      return;
    }

    if (mode === "decrypt" && !privateKeyPem.trim()) {
      setError("Private key is required for decryption.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      if (mode === "encrypt") {
        const cipher = await encrypt(input, publicKeyPem);
        setOutput(cipher);
      } else {
        const plain = await decrypt(input, privateKeyPem);
        setOutput(plain);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error while processing RSA";
      setError(
        mode === "encrypt"
          ? "Error encrypting: " + message
          : "Error decrypting: " +
              message +
              ". Check that the key and ciphertext are valid."
      );
      setOutput("");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const copyOutput = () => {
    if (output) {
      void navigator.clipboard.writeText(output);
    }
  };

  const copyPublicKey = () => {
    if (publicKeyPem) {
      void navigator.clipboard.writeText(publicKeyPem);
    }
  };

  const copyPrivateKey = () => {
    if (privateKeyPem) {
      void navigator.clipboard.writeText(privateKeyPem);
    }
  };

  const canProcess =
    input.trim().length > 0 &&
    ((mode === "encrypt" && publicKeyPem.trim().length > 0) ||
      (mode === "decrypt" && privateKeyPem.trim().length > 0));

  return (
    <div className="rsa-container">
      <div className="rsa-card">
        <div className="rsa-header">
          <div>
            <h1 className="rsa-title">RSA Encryption Tool</h1>
            <p className="rsa-subtitle">
              Generate RSA key pairs and encrypt/decrypt small texts with RSA‑OAEP
              (2048‑bit, SHA‑256).
            </p>
          </div>
          <div className="rsa-header-actions">
            <button
              className="rsa-btn-secondary"
              onClick={generateKeyPair}
              disabled={isGeneratingKeys}
            >
              {isGeneratingKeys ? "Generating..." : "Generate Keys"}
            </button>
            <button className="rsa-btn-secondary" onClick={clearAll}>
              Clear
            </button>
            <button
              className="rsa-btn-primary"
              onClick={handleProcess}
              disabled={!canProcess || isProcessing}
            >
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </button>
          </div>
        </div>

        <div className="rsa-controls">
          <div className="rsa-mode-selector">
            <label className="rsa-label" htmlFor="rsa-mode">
              Mode
            </label>
            <select
              id="rsa-mode"
              className="rsa-select"
              value={mode}
              onChange={(e) => setMode(e.target.value as RsaMode)}
            >
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>

          <div className="rsa-meta">
            <div>
              <span className="rsa-meta-label">Input Length:</span>
              <span className="rsa-meta-value">{input.length} chars</span>
            </div>
            <div>
              <span className="rsa-meta-label">Output Length:</span>
              <span className="rsa-meta-value">{output.length} chars</span>
            </div>
          </div>
        </div>

        <div className="rsa-grid-keys">
          <div className="rsa-section">
            <div className="rsa-key-header">
              <label htmlFor="rsa-public-key" className="rsa-label">
                Public Key (PEM)
              </label>
              <button
                className="copy-button"
                disabled={!publicKeyPem}
                onClick={copyPublicKey}
                title="Copy public key"
              >
                📋 Copy
              </button>
            </div>
            <textarea
              id="rsa-public-key"
              className="rsa-key-textarea"
              value={publicKeyPem}
              onChange={(e) => setPublicKeyPem(e.target.value)}
              placeholder="Click 'Generate Keys' or paste an existing public key PEM..."
              rows={8}
            />
          </div>

          <div className="rsa-section">
            <div className="rsa-key-header">
              <label htmlFor="rsa-private-key" className="rsa-label">
                Private Key (PEM)
              </label>
              <button
                className="copy-button"
                disabled={!privateKeyPem}
                onClick={copyPrivateKey}
                title="Copy private key"
              >
                📋 Copy
              </button>
            </div>
            <textarea
              id="rsa-private-key"
              className="rsa-key-textarea"
              value={privateKeyPem}
              onChange={(e) => setPrivateKeyPem(e.target.value)}
              placeholder="Click 'Generate Keys' or paste an existing private key PEM..."
              rows={8}
            />
          </div>
        </div>

        <div className="rsa-grid-io">
          <div className="rsa-section">
            <div className="rsa-io-header">
              <label htmlFor="rsa-input" className="rsa-label">
                {mode === "encrypt" ? "Plaintext Input" : "Ciphertext Input (Base64)"}
              </label>
            </div>
            <textarea
              id="rsa-input"
              className="rsa-textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder={
                mode === "encrypt"
                  ? "Enter small text to encrypt (a few hundred characters)..."
                  : "Paste Base64 ciphertext to decrypt..."
              }
              rows={10}
            />
          </div>

          <div className="rsa-section">
            <div className="rsa-io-header">
              <label htmlFor="rsa-output" className="rsa-label">
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
              id="rsa-output"
              className="rsa-textarea"
              value={output}
              readOnly
              placeholder={
                mode === "encrypt"
                  ? "Encrypted output will appear here..."
                  : "Decrypted text will appear here..."
              }
              rows={10}
            />
            {isProcessing && (
              <div className="rsa-status">
                {mode === "encrypt" ? "Encrypting..." : "Decrypting..."}
              </div>
            )}
          </div>
        </div>

        {error && <div className="rsa-error">{error}</div>}

        <div className="rsa-info">
          <p>
            <strong>Important:</strong> This tool is intended for learning and small snippets, not for
            large files. RSA‑OAEP is used for encrypting short messages using a 2048‑bit key and
            SHA‑256.
          </p>
          <p>
            Keep your <strong>private key secret</strong>. Anyone with the public key can encrypt
            messages that only the matching private key can decrypt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RsaEncryptionTool;


