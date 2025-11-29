import React, { useState } from "react";
import "./JsonDataGenerator.css";

type FieldType = 
  | "string" 
  | "number" 
  | "boolean" 
  | "date" 
  | "email" 
  | "name" 
  | "phone" 
  | "url" 
  | "uuid" 
  | "address" 
  | "city" 
  | "country" 
  | "lorem" 
  | "array" 
  | "object";

interface Field {
  id: string;
  name: string;
  type: FieldType;
  min?: number;
  max?: number;
}

const JsonDataGenerator: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([
    { id: "1", name: "id", type: "number", min: 1, max: 1000 },
    { id: "2", name: "name", type: "name" },
    { id: "3", name: "email", type: "email" },
    { id: "4", name: "active", type: "boolean" },
  ]);
  const [recordCount, setRecordCount] = useState(10);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateValue = (field: Field): any => {
    switch (field.type) {
      case "string":
        const min = field.min || 5;
        const max = field.max || 20;
        const length = Math.floor(Math.random() * (max - min + 1)) + min;
        return Array.from({ length }, () => 
          String.fromCharCode(97 + Math.floor(Math.random() * 26))
        ).join("");
      
      case "number":
        const numMin = field.min || 0;
        const numMax = field.max || 100;
        return Math.floor(Math.random() * (numMax - numMin + 1)) + numMin;
      
      case "boolean":
        return Math.random() > 0.5;
      
      case "date":
        const start = new Date(2020, 0, 1);
        const end = new Date();
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
      
      case "email":
        const domains = ["example.com", "test.com", "demo.org", "sample.net"];
        const username = Array.from({ length: 8 }, () => 
          String.fromCharCode(97 + Math.floor(Math.random() * 26))
        ).join("");
        return `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
      
      case "name":
        const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Emma"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      
      case "phone":
        return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      case "url":
        const protocols = ["https://", "http://"];
        const domains2 = ["example.com", "test.com", "demo.org"];
        const paths = ["", "/page", "/article", "/post"];
        return `${protocols[Math.floor(Math.random() * protocols.length)]}${domains2[Math.floor(Math.random() * domains2.length)]}${paths[Math.floor(Math.random() * paths.length)]}`;
      
      case "uuid":
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      
      case "address":
        const streets = ["Main St", "Oak Ave", "Park Blvd", "Elm St", "First St"];
        const numbers = Math.floor(Math.random() * 9999) + 1;
        return `${numbers} ${streets[Math.floor(Math.random() * streets.length)]}`;
      
      case "city":
        const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"];
        return cities[Math.floor(Math.random() * cities.length)];
      
      case "country":
        const countries = ["USA", "Canada", "UK", "Germany", "France", "Japan", "Australia", "Brazil"];
        return countries[Math.floor(Math.random() * countries.length)];
      
      case "lorem":
        const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];
        const wordCount = field.min || 5;
        return Array.from({ length: wordCount }, () => 
          words[Math.floor(Math.random() * words.length)]
        ).join(" ");
      
      case "array":
        const arrayLength = field.min || 3;
        return Array.from({ length: arrayLength }, (_, i) => `item${i + 1}`);
      
      case "object":
        return { key1: "value1", key2: "value2" };
      
      default:
        return "";
    }
  };

  const generateData = () => {
    try {
      setError(null);
      const records = Array.from({ length: recordCount }, () => {
        const record: Record<string, any> = {};
        fields.forEach((field) => {
          record[field.name] = generateValue(field);
        });
        return record;
      });

      const jsonOutput = JSON.stringify(records, null, 2);
      setOutput(jsonOutput);
    } catch (err) {
      setError("Error generating data: " + (err instanceof Error ? err.message : "Unknown error"));
      setOutput("");
    }
  };

  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      name: `field${fields.length + 1}`,
      type: "string",
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const clearAll = () => {
    setOutput("");
    setError(null);
  };

  const exportJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="json-gen-container">
      <div className="json-gen-card">
        <div className="json-gen-header">
          <div>
            <h1 className="json-gen-title">JSON Data Generator</h1>
            <p className="json-gen-subtitle">
              Create mock JSON data with customizable fields and types. Similar to Mockaroo.
            </p>
          </div>
          <div className="json-gen-header-buttons">
            <button className="json-gen-btn json-gen-btn-primary" onClick={generateData}>
              Generate
            </button>
            <button className="json-gen-btn json-gen-btn-reset" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>

        <div className="json-gen-main">
          {/* LEFT SIDE - SCHEMA BUILDER */}
          <div className="json-gen-schema">
            <div className="json-gen-schema-header">
              <h2 className="json-gen-section-title">Schema Builder</h2>
              <div className="json-gen-count-input">
                <label>Records:</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={recordCount}
                  onChange={(e) => setRecordCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                  className="json-gen-input-number"
                />
              </div>
            </div>

            <div className="json-gen-fields">
              {fields.map((field) => (
                <div key={field.id} className="json-gen-field-row">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    className="json-gen-input-name"
                    placeholder="Field name"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                    className="json-gen-select-type"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="email">Email</option>
                    <option value="name">Name</option>
                    <option value="phone">Phone</option>
                    <option value="url">URL</option>
                    <option value="uuid">UUID</option>
                    <option value="address">Address</option>
                    <option value="city">City</option>
                    <option value="country">Country</option>
                    <option value="lorem">Lorem Ipsum</option>
                    <option value="array">Array</option>
                    <option value="object">Object</option>
                  </select>
                  {(field.type === "string" || field.type === "number" || field.type === "lorem" || field.type === "array") ? (
                    <>
                      <input
                        type="number"
                        placeholder="Min"
                        value={field.min || ""}
                        onChange={(e) => updateField(field.id, { min: parseInt(e.target.value) || undefined })}
                        className="json-gen-input-minmax"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={field.max || ""}
                        onChange={(e) => updateField(field.id, { max: parseInt(e.target.value) || undefined })}
                        className="json-gen-input-minmax"
                      />
                    </>
                  ) : (
                    <>
                      <div className="json-gen-empty-cell"></div>
                      <div className="json-gen-empty-cell"></div>
                    </>
                  )}
                  <button
                    className="json-gen-btn-remove"
                    onClick={() => removeField(field.id)}
                    title="Remove field"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button className="json-gen-btn-add" onClick={addField}>
              + Add Field
            </button>
          </div>

          {/* RIGHT SIDE - OUTPUT */}
          <div className="json-gen-output-section">
            <div className="json-gen-output-header">
              <label className="json-gen-label">Generated JSON</label>
              <div className="json-gen-output-actions">
                <button
                  className="copy-button"
                  disabled={!output}
                  onClick={copyOutput}
                  title="Copy generated JSON"
                >
                  📋 Copy
                </button>
                <button
                  className="json-gen-btn-export"
                  disabled={!output}
                  onClick={exportJson}
                >
                  Export
                </button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              className="json-gen-textarea"
              placeholder="Click Generate to create JSON data..."
            />
            {error && (
              <div className="json-gen-error">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonDataGenerator;

