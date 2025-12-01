import React from "react";
import Base32Encoding from "./Base32Encoding";
import Base64Encoding from "./Base64Encoding";
import "./BaseEncodingPage.css";

interface BaseEncodingPageProps {
  family?: "base32" | "base64" | "both";
}

const BaseEncodingPage: React.FC<BaseEncodingPageProps> = ({
  family = "both",
}) => {

  return (
    <div className="base-encoding-page">
      <div className="base-encoding-page-inner">
        <div className="base-encoding-header">
          <div>
            <h1 className="base-encoding-title">Base Encoding</h1>
            <p className="base-encoding-subtitle">
              Work with Base32 and Base64 encodings in one place.
            </p>
          </div>
        </div>

        {(family === "base32" || family === "both") && (
          <div className="base-encoding-stack">
            <Base32Encoding mode="decode" />
            <Base32Encoding mode="encode" />
          </div>
        )}

        {(family === "base64" || family === "both") && (
          <div className="base-encoding-stack">
            <Base64Encoding mode="decode" />
            <Base64Encoding mode="encode" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseEncodingPage;


