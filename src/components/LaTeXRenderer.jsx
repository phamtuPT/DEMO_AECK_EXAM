import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const LaTeXRenderer = ({ children, block = false, className = "" }) => {
  if (!children) return null;

  // Function to render text with inline LaTeX
  const renderWithLaTeX = (text) => {
    if (typeof text !== "string") return text;

    // Split text by LaTeX delimiters
    const parts = text.split(/(\$[^$]+\$)/g);
    
    return parts.map((part, index) => {
      // Check if this part is LaTeX (wrapped in $)
      if (part.startsWith("$") && part.endsWith("$")) {
        const latex = part.slice(1, -1); // Remove $ delimiters
        try {
          return (
            <InlineMath key={index} math={latex} />
          );
        } catch (error) {
          console.error("LaTeX render error:", error);
          return <span key={index} className="text-red-500">[LaTeX Error: {latex}]</span>;
        }
      }
      return part;
    });
  };

  // For block math ($$...$$)
  if (block && typeof children === "string") {
    const blockMatch = children.match(/^\$\$(.*)\$\$$/);
    if (blockMatch) {
      try {
        return (
          <div className={className}>
            <BlockMath math={blockMatch[1]} />
          </div>
        );
      } catch (error) {
        console.error("LaTeX block render error:", error);
        return <div className={`text-red-500 ${className}`}>[LaTeX Error: {blockMatch[1]}]</div>;
      }
    }
  }

  return (
    <span className={className}>
      {renderWithLaTeX(children)}
    </span>
  );
};

export default LaTeXRenderer;
