import { useState } from "react";
import { diffWords } from "diff";
const ResumeChangeItem = ({ change }) => {
  const [copied, setCopied] = useState(false);

  const diff = diffWords(change.before, change.after);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(change.after);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        border: "1px solid #374151",
        borderRadius: "12px",
        marginBottom: "18px",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: "1px solid #374151",
          fontSize: "0.9rem",
        }}
      >
        <div style={{ padding: "10px", color: "#f87171" }}>BEFORE</div>
        <div style={{ padding: "10px", color: "#22c55e", position: "relative" }}>
          AFTER

          {/* COPY BUTTON */}
          <span
            onClick={handleCopy}
            title={copied ? "Text copied" : "Copy text"}
            style={{
              position: "absolute",
              right: "10px",
              top: "8px",
              cursor: "pointer",
            }}
          >
            {copied ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="3" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

        {/* BEFORE (with deletions highlighted) */}
        <div
          style={{
            padding: "12px",
            borderRight: "1px solid #374151",
            lineHeight: "1.6",
            fontSize: "0.9rem"
          }}
        >
          {diff.map((part, idx) => {
            if (part.removed) {
              return (
                <span
                  key={idx}
                  style={{
                    background: "rgba(248,113,113,0.18)",
                    color: "#f87171",
                    textDecoration: "line-through",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    marginRight: "2px",
                  }}
                >
                  {part.value}
                </span>
              );
            }

            if (!part.added) {
              return <span key={idx}>{part.value}</span>;
            }

            return null;
          })}
        </div>

        {/* AFTER (with additions highlighted) */}
        <div style={{
          padding: "12px", lineHeight: "1.6", fontSize: "0.9rem"
        }}>
          {diff.map((part, idx) => {
            if (part.added) {
              return (
                <span
                  key={idx}
                  style={{
                    background: "rgba(34,197,94,0.18)",
                    color: "#22c55e",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    marginRight: "2px",
                  }}
                >
                  {part.value}
                </span>
              );
            }

            if (!part.removed) {
              return <span key={idx}>{part.value}</span>;
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default ResumeChangeItem;