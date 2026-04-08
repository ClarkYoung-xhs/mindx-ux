import React from "react";

const DividerBlock: React.FC = () => {
  return (
    <div style={{ padding: "8px 0" }}>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e0e0e0",
          margin: 0,
        }}
      />
    </div>
  );
};

export default DividerBlock;
