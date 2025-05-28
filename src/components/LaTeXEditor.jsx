import React, { useState } from "react";
import { Input, Card, Button, Space, Tooltip } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import LaTeXRenderer from "./LaTeXRenderer";

const { TextArea } = Input;

const LaTeXEditor = ({
  value,
  onChange,
  placeholder = "Nhập nội dung (hỗ trợ LaTeX với $...$ cho công thức)",
  rows = 4,
  showPreview = true
}) => {
  const [previewVisible, setPreviewVisible] = useState(showPreview);

  const commonSymbols = [
    { symbol: "\\frac{a}{b}", label: "Phân số" },
    { symbol: "x^2", label: "Lũy thừa" },
    { symbol: "\\sqrt{x}", label: "Căn bậc hai" },
    { symbol: "\\sum_{i=1}^{n}", label: "Tổng" },
    { symbol: "\\int_{a}^{b}", label: "Tích phân" },
    { symbol: "\\lim_{x \\to \\infty}", label: "Giới hạn" },
    { symbol: "\\alpha, \\beta, \\gamma", label: "Hy Lạp" },
    { symbol: "\\leq, \\geq, \\neq", label: "So sánh" },
  ];

  const insertSymbol = (symbol) => {
    const newValue = value ? `${value}$${symbol}$` : `$${symbol}$`;
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* LaTeX Symbols Toolbar */}
      <Card size="small" title="Ký hiệu LaTeX thường dùng">
        <Space wrap>
          {commonSymbols.map((item, index) => (
            <Tooltip key={index} title={item.label}>
              <Button
                size="small"
                onClick={() => insertSymbol(item.symbol)}
                className="font-mono text-xs"
              >
                <LaTeXRenderer>{`$${item.symbol}$`}</LaTeXRenderer>
              </Button>
            </Tooltip>
          ))}
        </Space>
      </Card>

      {/* Editor */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Nội dung:</label>
          <Button
            size="small"
            icon={previewVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setPreviewVisible(!previewVisible)}
          >
            {previewVisible ? "Ẩn preview" : "Hiện preview"}
          </Button>
        </div>

        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono"
        />
      </div>

      {/* Preview */}
      {previewVisible && (
        <Card size="small" title="Preview" className="bg-gray-50">
          <div className="min-h-[60px] p-2">
            {value ? (
              <LaTeXRenderer>{value}</LaTeXRenderer>
            ) : (
              <span className="text-gray-400 italic">Preview sẽ hiển thị ở đây...</span>
            )}
          </div>
        </Card>
      )}

      {/* Help */}
      <Card size="small" title="Hướng dẫn LaTeX">
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Sử dụng <code>$...$</code> để bao quanh công thức LaTeX</p>
          <p>• Ví dụ: <code>$x^2 + y^2 = z^2$</code> → <LaTeXRenderer>$x^2 + y^2 = z^2$</LaTeXRenderer></p>
          <p>• Phân số: <code>\frac{`{a}`}{`{b}`}</code> → <LaTeXRenderer>$\frac{1}{2}$</LaTeXRenderer></p>
          <p>• Căn bậc hai: <code>\sqrt{`{x}`}</code> → <LaTeXRenderer>$\sqrt{2}$</LaTeXRenderer></p>
        </div>
      </Card>
    </div>
  );
};

export default LaTeXEditor;
