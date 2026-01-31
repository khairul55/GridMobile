import React, { memo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Cell from './Cell';
import { RootState } from '../../store/store';
import { updateCell } from '../../store/slices/workbookSlice';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 40;
const VISIBLE_ROWS = 20;

const Row = memo(({ row, sheetId }: { row: number; sheetId: string }) => {
  const colCount = useSelector((state: RootState) => state.workbook.currentWorkbook?.sheets[sheetId].colCount) || 26;
  
  // Optimization: Generate array of column indices
  const cols = Array.from({ length: colCount }, (_, i) => i);

  const renderCell = useCallback(({ item }: { item: number }) => (
    <Cell sheetId={sheetId} row={row} col={item} />
  ), [sheetId, row]);

  return (
    <View style={styles.row}>
      <FlatList
        data={cols}
        horizontal
        renderItem={renderCell}
        keyExtractor={(item) => `${row}:${item}`}
        initialNumToRender={5}
        windowSize={3}
        getItemLayout={(data, index) => ({ length: CELL_WIDTH, offset: CELL_WIDTH * index, index })}
        removeClippedSubviews={true}
      />
    </View>
  );
}, (prev, next) => prev.row === next.row && prev.sheetId === next.sheetId);

interface VirtualGridProps {
  sheetId: string;
}

const VirtualGrid: React.FC<VirtualGridProps> = ({ sheetId }) => {
  const rowCount = useSelector((state: RootState) => state.workbook.currentWorkbook?.sheets[sheetId].rowCount) || 100;
  const rows = Array.from({ length: rowCount }, (_, i) => i);

  const renderRow = useCallback(({ item }: { item: number }) => (
    <Row row={item} sheetId={sheetId} />
  ), [sheetId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        renderItem={renderRow}
        keyExtractor={(item) => `row-${item}`}
        initialNumToRender={VISIBLE_ROWS}
        windowSize={5}
        getItemLayout={(data, index) => ({ length: CELL_HEIGHT, offset: CELL_HEIGHT * index, index })}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    height: CELL_HEIGHT,
  },
});

export default VirtualGrid;
