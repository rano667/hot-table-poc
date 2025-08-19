// src/validateSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lineItems: [
    { item: "Apple", description: "Fresh red apple", qty: 10, price: 5 },
    { item: "Banana", description: "Ripe bananas", qty: 6, price: 3 },
  ],
};

const validateSlice = createSlice({
  name: "validate",
  initialState,
  reducers: {
    updateLineItem: (state, action) => {
      const { row, prop, value } = action.payload;
      if (state.lineItems[row]) {
        state.lineItems[row][prop] = value;
      }
    },
    setLineItems: (state, action) => {
      state.lineItems = action.payload;
    },
    addLineItemAbove: (state, action) => {
      const { index } = action.payload;
      if (state.lineItems.length > 0) {
        const keys = Object.keys(state.lineItems[0]);
        const newRow = {};
        keys.forEach((k) => (newRow[k] = ""));
        state.lineItems.splice(index, 0, newRow);
      }
    },
    addLineItemBelow: (state, action) => {
      const { index } = action.payload;
      if (state.lineItems.length > 0) {
        const keys = Object.keys(state.lineItems[0]);
        const newRow = {};
        keys.forEach((k) => (newRow[k] = ""));
        state.lineItems.splice(index + 1, 0, newRow);
      }
    },
    deleteLineItemRow: (state, action) => {
      const index = action.payload;
      state.lineItems = state.lineItems.filter((_, i) => i !== index);
    },
    duplicateLineItemRow: (state, action) => {
      const index = action.payload;
      if (state.lineItems[index]) {
        const copy = { ...state.lineItems[index] };
        state.lineItems.splice(index + 1, 0, copy);
      }
    },
  },
});

export const {
  updateLineItem,
  setLineItems,
  addLineItemAbove,
  addLineItemBelow,
  deleteLineItemRow,
  duplicateLineItemRow,
} = validateSlice.actions;

export default validateSlice.reducer;
