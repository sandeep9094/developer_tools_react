import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ulid } from "ulid";
import { nanoid } from "nanoid";
import "./UlidUuidGenerator.css";

// UUID v6 Generator - Time-ordered UUID
const generateUuidV6 = (): string => {
  const now = Date.now();
  const timestamp = BigInt(now) * 10000n + BigInt(Math.floor(Math.random() * 10000));
  
  // Convert timestamp to UUID v6 format
  const timeLow = Number(timestamp & 0xffffffffn);
  const timeMid = Number((timestamp >> 32n) & 0xffffn);
  const timeHigh = Number((timestamp >> 48n) & 0xfffn);
  
  // Version 6 (0110 in binary)
  const version = 0x6;
  const timeHighAndVersion = (timeHigh << 4) | version;
  
  // Variant (10 in binary for RFC 4122)
  const variant = 0x8;
  const clockSeqLow = Math.floor(Math.random() * 256) | variant;
  const clockSeqHigh = Math.floor(Math.random() * 256) & 0x3f;
  
  // Node (48 bits random)
  const node = new Uint8Array(6);
  crypto.getRandomValues(node);
  
  // Format as UUID string
  const uuid = [
    timeLow.toString(16).padStart(8, '0'),
    timeMid.toString(16).padStart(4, '0'),
    timeHighAndVersion.toString(16).padStart(4, '0'),
    ((clockSeqHigh << 8) | clockSeqLow).toString(16).padStart(4, '0'),
    Array.from(node).map(b => b.toString(16).padStart(2, '0')).join('')
  ].join('-');
  
  return uuid;
};

const UlidUuidGenerator: React.FC = () => {
  const [uuid, setUuid] = useState("");
  const [uuidV6, setUuidV6] = useState("");
  const [ulidValue, setUlidValue] = useState("");
  const [nanoId, setNanoId] = useState("");
  const [nanoLength, setNanoLength] = useState(21);

  const copyToClipboard = (value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
  };

  const generateUuid = () => setUuid(uuidv4());
  const generateUuidV6Func = () => setUuidV6(generateUuidV6());
  const generateUlid = () => setUlidValue(ulid());

  const generateNanoId = () => {
    const len = Math.max(4, nanoLength || 21);
    setNanoId(nanoid(len));
  };

  const clearAll = () => {
    setUuid("");
    setUuidV6("");
    setUlidValue("");
    setNanoId("");
  };

  return (
    <div className="ulid-uuid-container">
      <div className="ulid-uuid-card">
        <div className="ulid-uuid-header">
          <div>
            <h1 className="ulid-uuid-title">ULID & UUID Generator</h1>
            <p className="ulid-uuid-subtitle">
              Generate UUIDs, ULIDs, and Nano IDs for your applications.
            </p>
          </div>
          <button className="ulid-uuid-btn-reset" onClick={clearAll}>
            Clear All
          </button>
        </div>

        <div className="ulid-uuid-grid">
          {/* UUID v4 */}
          <div className="ulid-uuid-section">
            <div className="ulid-uuid-section-header">
              <h2 className="ulid-uuid-section-title">UUID v4</h2>
            </div>
            <div className="ulid-uuid-actions-container">
              <div className="ulid-uuid-actions">
                <button className="ulid-uuid-btn-primary" onClick={generateUuid}>
                  Generate
                </button>
                <button
                  className="ulid-uuid-btn-secondary"
                  disabled={!uuid}
                  onClick={() => copyToClipboard(uuid)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="ulid-uuid-output">
              {uuid || "Click Generate to create a UUID"}
            </div>
          </div>

          {/* UUID v6 */}
          <div className="ulid-uuid-section">
            <div className="ulid-uuid-section-header">
              <h2 className="ulid-uuid-section-title">UUID v6</h2>
            </div>
            <div className="ulid-uuid-actions-container">
              <div className="ulid-uuid-actions">
                <button className="ulid-uuid-btn-primary" onClick={generateUuidV6Func}>
                  Generate
                </button>
                <button
                  className="ulid-uuid-btn-secondary"
                  disabled={!uuidV6}
                  onClick={() => copyToClipboard(uuidV6)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="ulid-uuid-output">
              {uuidV6 || "Click Generate to create a UUID v6"}
            </div>
          </div>

          {/* ULID */}
          <div className="ulid-uuid-section">
            <div className="ulid-uuid-section-header">
              <h2 className="ulid-uuid-section-title">ULID</h2>
            </div>
            <div className="ulid-uuid-actions-container">
              <div className="ulid-uuid-actions">
                <button className="ulid-uuid-btn-primary" onClick={generateUlid}>
                  Generate
                </button>
                <button
                  className="ulid-uuid-btn-secondary"
                  disabled={!ulidValue}
                  onClick={() => copyToClipboard(ulidValue)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="ulid-uuid-output">
              {ulidValue || "Click Generate to create a ULID"}
            </div>
          </div>

          {/* NANO ID */}
          <div className="ulid-uuid-section">
            <div className="ulid-uuid-section-header">
              <h2 className="ulid-uuid-section-title">Nano ID</h2>
            </div>
            <div className="ulid-uuid-actions-container">
              <div className="ulid-uuid-actions">
                <input
                  type="number"
                  min={4}
                  value={nanoLength}
                  onChange={(e) => setNanoLength(parseInt(e.target.value, 10))}
                  className="ulid-uuid-input-small"
                  placeholder="Length"
                />
                <button className="ulid-uuid-btn-primary" onClick={generateNanoId}>
                  Generate
                </button>
                <button
                  className="ulid-uuid-btn-secondary"
                  disabled={!nanoId}
                  onClick={() => copyToClipboard(nanoId)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="ulid-uuid-output">
              {nanoId || "Set length & click Generate"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UlidUuidGenerator;

