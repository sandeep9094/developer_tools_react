import { useEffect, useMemo, useState } from "react";
import Ajv, { ErrorObject } from "ajv";
import "./JsonSchemaValidator.css";

type ValidationState = "idle" | "valid" | "invalid";

const defaultSchema = `{
  "type": "object",
  "required": ["id", "email"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "active": { "type": "boolean" }
  },
  "additionalProperties": false
}`;

const defaultData = `{
  "id": 1,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "active": true
}`;

function JsonSchemaValidator() {
  const ajv = useMemo(
    () =>
      new Ajv({
        allErrors: true,
        strict: false,
        allowUnionTypes: true,
      }),
    []
  );

  const [schemaInput, setSchemaInput] = useState(defaultSchema);
  const [dataInput, setDataInput] = useState(defaultData);
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastValidated, setLastValidated] = useState<Date | null>(null);

  const parseJson = (value: string, setError: (msg: string | null) => void) => {
    try {
      const result = JSON.parse(value);
      setError(null);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to parse JSON content."
      );
      return null;
    }
  };

  const buildSuggestions = (errs: ErrorObject[]): string[] => {
    const tips: string[] = [];

    errs.forEach((err) => {
      const path = err.instancePath || "/";

      switch (err.keyword) {
        case "type":
          tips.push(
            `Ensure ${path} is of type "${err.params.type}". Update the data or schema accordingly.`
          );
          break;
        case "required":
          tips.push(
            `Add missing property "${(err.params as any).missingProperty}" under ${path}.`
          );
          break;
        case "additionalProperties":
          tips.push(
            `Remove unexpected property "${
              (err.params as any).additionalProperty
            }" or allow it with "additionalProperties: true".`
          );
          break;
        case "enum":
          tips.push(
            `Use one of the allowed values ${JSON.stringify(
              (err.params as any).allowedValues
            )} at ${path}.`
          );
          break;
        case "minLength":
        case "maxLength":
          tips.push(
            `Adjust the length of ${path} or update the schema constraint (${err.message}).`
          );
          break;
        case "minimum":
        case "maximum":
          tips.push(
            `Update the numeric value at ${path} or relax the schema constraint (${err.message}).`
          );
          break;
        default:
          tips.push(err.message ?? "Resolve the highlighted schema error.");
      }
    });

    return tips;
  };

  const validate = () => {
    const parsedSchema = parseJson(schemaInput, setSchemaError);
    const parsedData = parseJson(dataInput, setDataError);

    if (!parsedSchema || !parsedData) {
      setValidationState("invalid");
      setErrors([]);
      setSuggestions([]);
      return;
    }

    try {
      const validateFn = ajv.compile(parsedSchema);
      const valid = validateFn(parsedData);

      if (valid) {
        setValidationState("valid");
        setErrors([]);
        setSuggestions([]);
      } else {
        const errs = validateFn.errors ?? [];
        setValidationState("invalid");
        setErrors(errs);
        setSuggestions(buildSuggestions(errs));
      }
      setLastValidated(new Date());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to validate schema.";
      setSchemaError(message);
      setValidationState("invalid");
      setErrors([]);
      setSuggestions([message]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!schemaInput.trim() && !dataInput.trim()) {
        setValidationState("idle");
        setErrors([]);
        setSuggestions([]);
        return;
      }
      validate();
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaInput, dataInput]);

  const validationBadge =
    validationState === "valid"
      ? "status-chip success"
      : validationState === "invalid"
      ? "status-chip error"
      : "status-chip";

  const formatTimestamp = (date: Date | null) =>
    date ? date.toLocaleTimeString() : "Not validated yet";

  return (
    <div className="schema-validator-container">
      <div className="schema-validator-card">
        <div className="schema-validator-header">
          <div>
            <h1 className="schema-validator-title">JSON Schema Validator</h1>
            <p className="schema-validator-subtitle">
              Validate JSON documents against your schemas. Automatic parsing,
              inline suggestions, and detailed error reporting.
            </p>
          </div>
          <div className="schema-validator-actions">
            <span className={validationBadge}>
              {validationState === "valid"
                ? "Valid"
                : validationState === "invalid"
                ? "Needs attention"
                : "Idle"}
            </span>
            <button className="schema-btn-secondary" onClick={validate}>
              Validate Now
            </button>
            <button
              className="schema-btn-muted"
              onClick={() => {
                setSchemaInput(defaultSchema);
                setDataInput(defaultData);
                setSchemaError(null);
                setDataError(null);
              }}
            >
              Reset Samples
            </button>
          </div>
        </div>

        <div className="schema-validator-meta">
          <div>
            <span className="meta-label">Last validated:</span>
            <span className="meta-value">{formatTimestamp(lastValidated)}</span>
          </div>
          <div>
            <span className="meta-label">Schema size:</span>
            <span className="meta-value">{schemaInput.length} chars</span>
          </div>
          <div>
            <span className="meta-label">Data size:</span>
            <span className="meta-value">{dataInput.length} chars</span>
          </div>
        </div>

        <div className="schema-validator-grid">
          <div className="schema-section">
            <label className="schema-label">JSON Schema</label>
            <textarea
              value={schemaInput}
              onChange={(e) => setSchemaInput(e.target.value)}
              className={`schema-textarea ${
                schemaError ? "schema-textarea-error" : ""
              }`}
              spellCheck={false}
            />
            {schemaError && <p className="schema-error-text">{schemaError}</p>}
          </div>

          <div className="schema-section">
            <label className="schema-label">JSON Data</label>
            <textarea
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className={`schema-textarea ${
                dataError ? "schema-textarea-error" : ""
              }`}
              spellCheck={false}
            />
            {dataError && <p className="schema-error-text">{dataError}</p>}
          </div>
        </div>

        <div className="schema-results">
          <div>
            <h2>Validation Details</h2>
            {errors.length === 0 && validationState === "valid" ? (
              <p className="schema-valid-message">
                ✅ Everything looks good! The JSON document satisfies the
                provided schema.
              </p>
            ) : (
              <ul className="schema-error-list">
                {errors.map((error, idx) => (
                  <li key={`${error.instancePath}-${idx}`}>
                    <span className="schema-error-path">
                      {error.instancePath || "/"}
                    </span>
                    {error.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2>Suggestions</h2>
            {suggestions.length === 0 ? (
              <p className="schema-suggestion-placeholder">
                No suggestions yet. Fix detected errors to see guidance.
              </p>
            ) : (
              <ul className="schema-suggestion-list">
                {suggestions.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonSchemaValidator;

