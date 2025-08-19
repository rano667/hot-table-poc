import React, { useState } from "react";
import LineItemsTable from "./LineItemsTable";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div style={{ padding: 16 }}>
      <h2>Handsontable + Redux POC</h2>
      <button onClick={() => setIsDark((d) => !d)}>Toggle Theme</button>

      <LineItemsTable isDark={isDark} />
    </div>
  );
}
