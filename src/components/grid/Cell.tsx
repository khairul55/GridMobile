import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedCell } from '../../store/slices/uiSlice';

interface CellProps {
  sheetId: string;
  row: number;
  col: number;
}

const Cell = memo(({ sheetId, row, col }: CellProps) => {
  const dispatch = useDispatch();
  
  // Select specific cell data from Redux
  const cellData = useSelector((state: RootState) => {
    const cellId = `${row}:${col}`;
    return state.workbook.currentWorkbook?.sheets[sheetId].cells[cellId];
  });

  const isSelected = useSelector((state: RootState) => {
    const sel = state.ui.selection;
    return sel && sel.row === row && sel.col === col;
  });

  const handlePress = () => {
    dispatch(setSelectedCell({ row, col }));
  };

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        isSelected && styles.selected,
        cellData?.style?.backgroundColor ? { backgroundColor: cellData.style.backgroundColor } : undefined
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Text 
        style={[
          styles.text,
          cellData?.style?.bold && { fontWeight: 'bold' },
          cellData?.style?.color && { color: cellData.style.color },
          { textAlign: cellData?.style?.align || 'left' }
        ]}
        numberOfLines={1}
      >
        {cellData?.value ?? ''}
      </Text>
    </TouchableOpacity>
  );
}, (prev, next) => {
  // Custom equality check for performance
  return (
    prev.row === next.row &&
    prev.col === next.col &&
    prev.sheetId === next.sheetId
  );
});

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 40,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 4,
    justifyContent: 'center',
  },
  selected: {
    borderColor: '#2196F3',
    borderWidth: 2,
    zIndex: 10,
  },
  text: {
    fontSize: 14,
    color: '#000',
  }
});

export default Cell;
