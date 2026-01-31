import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workbook, CellID, CellStyle } from '../../types';
import { formulaEngine } from '../../services/engine/FormulaEngine';

interface WorkbookState {
  currentWorkbook: Workbook | null;
  loading: boolean;
  dirty: boolean; // Needs sync
}

const initialState: WorkbookState = {
  currentWorkbook: null,
  loading: false,
  dirty: false,
};

const workbookSlice = createSlice({
  name: 'workbook',
  initialState,
  reducers: {
    setWorkbook: (state, action: PayloadAction<Workbook>) => {
      state.currentWorkbook = action.payload;
    },
    updateCell: (state, action: PayloadAction<{ sheetId: string; row: number; col: number; input: string }>) => {
      if (!state.currentWorkbook) return;
      const { sheetId, row, col, input } = action.payload;
      const sheet = state.currentWorkbook.sheets[sheetId];
      const cellId = `${row}:${col}`;

      // 1. Calculate value
      const { value } = formulaEngine.evaluate(sheet, row, col, input);

      // 2. Update Cell
      if (!sheet.cells[cellId]) {
        sheet.cells[cellId] = { value, formula: input };
      } else {
        sheet.cells[cellId].value = value;
        sheet.cells[cellId].formula = input;
      }

      // 3. Mark for sync
      state.dirty = true;
      state.currentWorkbook.updatedAt = Date.now();
      
      // Note: A real implementation would now trigger a recursive update 
      // of all dependent cells based on the DependencyGraph.
    },
    updateCellStyle: (state, action: PayloadAction<{ sheetId: string; cellId: string; style: Partial<CellStyle> }>) => {
      if (!state.currentWorkbook) return;
      const { sheetId, cellId, style } = action.payload;
      const cell = state.currentWorkbook.sheets[sheetId].cells[cellId];
      if (cell) {
        cell.style = { ...cell.style, ...style };
        state.dirty = true;
      }
    },
  },
});

export const { setWorkbook, updateCell, updateCellStyle } = workbookSlice.actions;
export default workbookSlice.reducer;
