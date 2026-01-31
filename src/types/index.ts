export type CellID = string; // format "row:col" e.g., "0:1" for A2

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  color?: string;
  backgroundColor?: string;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'percentage';
}

export interface CellData {
  value: string | number | null; // The computed result
  formula: string; // The raw input (e.g., "=SUM(A1:A5)") or raw text
  style?: CellStyle;
}

export interface SheetData {
  id: string;
  name: string;
  cells: Record<CellID, CellData>;
  rowCount: number;
  colCount: number;
  columnWidths: Record<number, number>;
  rowHeights: Record<number, number>;
}

export interface Workbook {
  id: string;
  ownerId: string;
  title: string;
  sheets: Record<string, SheetData>;
  activeSheetId: string;
  collaborators: string[];
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface SelectionArea {
  start: { row: number; col: number };
  end: { row: number; col: number };
}
