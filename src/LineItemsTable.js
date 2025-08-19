import React, { useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";

import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

import {
  updateLineItem,
  addLineItemAbove,
  addLineItemBelow,
  deleteLineItemRow,
  duplicateLineItemRow,
} from "./validateSlice";

registerAllModules();

export default function LineItemsTable({ isDark }) {
  const hotRef = useRef(null);
  const dispatch = useDispatch();
  const lineItems = useSelector((state) => state.validate.lineItems);

  const columns = [
    { data: "item", type: "text", width: 140 },
    { data: "description", type: "text", width: 300 },
    { data: "qty", type: "numeric", width: 80 },
    { data: "price", type: "numeric", width: 80 },
  ];
  const colHeaders = ["Item", "Description", "Qty", "Price"];

  // Sync edits to Redux
  const afterChange = useCallback(
    (changes, source) => {
      if (!changes || source === "loadData") return;
      changes.forEach(([row, prop, , newVal]) => {
        dispatch(updateLineItem({ row, prop, value: newVal }));
      });
    },
    [dispatch]
  );

  // Custom context menu
  const contextMenu = {
    items: {
      row_above: {
        name: "Insert row above",
        callback(_, selection) {
          const row = selection[0].start.row;
          dispatch(addLineItemAbove({ index: row }));
        },
      },
      row_below: {
        name: "Insert row below",
        callback(_, selection) {
          const row = selection[0].start.row;
          dispatch(addLineItemBelow({ index: row }));
        },
      },
      duplicate_row: {
        name: "Duplicate row",
        callback(_, selection) {
          const row = selection[0].start.row;
          dispatch(duplicateLineItemRow(row));
        },
      },
      remove_row: {
        name: "Delete row",
        callback(_, selection) {
          const row = selection[0].start.row;
          dispatch(deleteLineItemRow(row));
        },
      },
    },
  };

  // ✅ Export CSV button
  const exportCSV = () => {
    const hot = hotRef.current?.hotInstance;
    hot?.getPlugin("exportFile").downloadFile("csv", {
      filename: "LineItems",
      bom: true,
      columnHeaders: true,
    });
  };

  // ✅ Jump & Flash button
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
      <h3>Line Items (Handsontable)</h3>
      <div style={{ marginBottom: 8 }}>
        <button onClick={exportCSV} style={{ marginRight: 8 }}>
          Export CSV
        </button>
        <button onClick={() => highlightCell(1, 0)}>
          Jump to Row 2, Col 1
        </button>
      </div>

      <HotTable
        ref={hotRef}
        data={lineItems.map((r) => ({ ...r }))} // clone rows to avoid immutability error
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders
        contextMenu={contextMenu}
        stretchH="all"
        afterChange={afterChange}
        height={320}
        licenseKey="non-commercial-and-evaluation"
        themeName={isDark ? "ht-theme-main-dark" : "ht-theme-main"}
      />

      <style>{`.flash-cell { outline: 2px solid orange !important; }`}</style>
    </div>
  );
}
