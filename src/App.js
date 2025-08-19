import React, { useState, useCallback, useRef } from "react";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";

// ✅ v16 style imports (base + theme)
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

registerAllModules();

export default function App() {
  const hotRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  const [lineItems, setLineItems] = useState([
    { item: "Apple", description: "Fresh red apple", qty: 10, price: 5 },
    { item: "Banana", description: "Ripe bananas", qty: 6, price: 3 },
    { item: "Cherry", description: "Sweet cherries", qty: 15, price: 8 },
  ]);

  const columns = [
    { data: "item", type: "text", width: 140 },
    { data: "description", type: "text", width: 300 },
    { data: "qty", type: "numeric", width: 80 },
    { data: "price", type: "numeric", width: 80 },
  ];
  const colHeaders = ["Item", "Description", "Qty", "Price"];

  const afterChange = useCallback((changes, source) => {
    if (!changes || source === "loadData") return;
    setLineItems((prev) => {
      const copy = [...prev];
      changes.forEach(([row, prop, , newVal]) => {
        if (copy[row]) copy[row][prop] = newVal;
      });
      return copy;
    });
  }, []);

  const exportCSV = () => {
    const hot = hotRef.current?.hotInstance;
    hot?.getPlugin("exportFile").downloadFile("csv", {
      filename: "LineItems",
      bom: true,
      columnHeaders: true,
    });
  };

  const highlightCell = (row, col) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;
    hot.scrollViewportTo(row, col);
    hot.selectCell(row, col);
    hot.addHookOnce("afterRender", () => {
      const td = hot.getCell(row, col);
      if (td) {
        td.classList.add("flash-cell");
        setTimeout(() => td.classList.remove("flash-cell"), 1200);
      }
    });
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Handsontable POC — Themes fixed</h2>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setIsDark((d) => !d)} style={{ marginRight: 8 }}>
          Toggle Theme
        </button>
        <button onClick={exportCSV} style={{ marginRight: 8 }}>
          Export CSV
        </button>
        <button onClick={() => highlightCell(1, 0)}>
          Jump to Row 2, Col 1
        </button>
      </div>

      <HotTable
        ref={hotRef}
        data={lineItems}
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders
        contextMenu
        stretchH="all"
        afterChange={afterChange}
        height={320}
        licenseKey="non-commercial-and-evaluation"
        // ✅ Correct theme names
        themeName={isDark ? "ht-theme-main-dark" : "ht-theme-main"}
      />

      <style>{`.flash-cell { outline: 2px solid orange !important; }`}</style>
    </div>
  );
}
