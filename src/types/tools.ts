export type Tool =
  | "json-beautifier"
  | "base-encoding"
  | "base32-encode"
  | "base32-decode"
  | "base64-encode"
  | "base64-decode"
  | "diff-checker"
  | "lorem-ipsum-generator"
  | "color-picker"
  | "regex-matcher"
  | "ulid-uuid-generator"
  | "id-password-generator"
  | "json-data-generator"
  | "hashing-tool"
  | "json-schema-validator"
  | "jwt-decoder"
  | "qr-generator"
  | "cli-command-breaks";

export type BaseEncodingMode = "base32-encode" | "base32-decode" | "base64-encode" | "base64-decode";
