import React, { useState } from "react";
import { v4 as uuidv4, v6 as uuidv6 } from "uuid";
import { ulid } from "ulid";
import { nanoid } from "nanoid";
import "./UlidUuidGenerator.css";

const UlidUuidGenerator: React.FC = () => {
  const [uuid, setUuid] = useState("");
  const [uuidVersion, setUuidVersion] = useState<"v4" | "v6">("v4");
  const [ulidValue, setUlidValue] = useState("");
  const [nanoId, setNanoId] = useState("");
  const [nanoLength, setNanoLength] = useState(21);

  const copyToClipboard = (value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
  };

  const generateUuid = () => {
    if (uuidVersion === "v6") {
      setUuid(uuidv6());
    } else {
      setUuid(uuidv4());
    }
  };
  const generateUlid = () => setUlidValue(ulid());

  const generateNanoId = () => {
    const len = Math.max(4, nanoLength || 21);
    setNanoId(nanoid(len));
  };

  const clearAll = () => {
    setUuid("");
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
          {/* UUID */}
          <div className="ulid-uuid-section">
            <div className="ulid-uuid-section-header">
              <h2 className="ulid-uuid-section-title">UUID</h2>
            </div>
            <div className="ulid-uuid-actions-container">
              <div className="ulid-uuid-actions">
                <select
                  value={uuidVersion}
                  onChange={(e) => setUuidVersion(e.target.value as "v4" | "v6")}
                  className="ulid-uuid-select"
                >
                  <option value="v4">v4</option>
                  <option value="v6">v6</option>
                </select>
                <button className="ulid-uuid-btn-primary" onClick={generateUuid}>
                  Generate
                </button>
                <button
                  className="copy-button"
                  disabled={!uuid}
                  onClick={() => copyToClipboard(uuid)}
                  title="Copy UUID"
                >
                  📋 Copy
                </button>
              </div>
            </div>
            <div className="ulid-uuid-output">
              {uuid || `Click Generate to create a UUID ${uuidVersion}`}
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
                  className="copy-button"
                  disabled={!ulidValue}
                  onClick={() => copyToClipboard(ulidValue)}
                  title="Copy ULID"
                >
                  📋 Copy
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
                  className="copy-button"
                  disabled={!nanoId}
                  onClick={() => copyToClipboard(nanoId)}
                  title="Copy Nano ID"
                >
                  📋 Copy
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

