import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCell } from '../../store/slices/workbookSlice';

const FormulaBar = () => {
  const dispatch = useDispatch();
  const { currentWorkbook } = useSelector((state: RootState) => state.workbook);
  const { activeSheetId } = currentWorkbook!;
  const selection = useSelector((state: RootState) => state.ui.selection);

  const [text, setText] = useState('');

  // Update internal state when selection changes
  useEffect(() => {
    if (selection && currentWorkbook) {
      const cellId = `${selection.row}:${selection.col}`;
      const cell = currentWorkbook.sheets[activeSheetId].cells[cellId];
      setText(cell ? cell.formula : '');
    }
  }, [selection, currentWorkbook, activeSheetId]);

  const handleSubmit = () => {
    if (selection && currentWorkbook) {
      dispatch(updateCell({
        sheetId: activeSheetId,
        row: selection.row,
        col: selection.col,
        input: text
      }));
      Keyboard.dismiss();
    }
  };

  if (!selection) return null;

  return (
    <View style={styles.container}>
      <View style={styles.addressBadge}>
        <Text style={styles.addressText}>{String.fromCharCode(65 + selection.col)}{selection.row + 1}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        placeholder="Enter value or formula"
        keyboardType={text.startsWith('=') ? 'default' : 'numbers-and-punctuation'}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#f1f3f4',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  addressBadge: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
  }
});

export default FormulaBar;
