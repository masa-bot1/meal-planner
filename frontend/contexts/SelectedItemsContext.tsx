import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SelectedItem {
  name: string;
  category: string;
}

interface SelectedItemsContextType {
  selectedItems: SelectedItem[];
  addItem: (item: SelectedItem) => void;
  removeItem: (itemName: string) => void;
  clearAll: () => void;
  isSelected: (itemName: string) => boolean;
}

const SelectedItemsContext = createContext<SelectedItemsContextType | undefined>(undefined);

export function SelectedItemsProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const addItem = (item: SelectedItem) => {
    setSelectedItems(prev => {
      if (prev.some(selectedItem => selectedItem.name === item.name)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (itemName: string) => {
    setSelectedItems(prev => prev.filter(item => item.name !== itemName));
  };

  const clearAll = () => {
    setSelectedItems([]);
  };

  const isSelected = (itemName: string) => {
    return selectedItems.some(item => item.name === itemName);
  };

  const value = {
    selectedItems,
    addItem,
    removeItem,
    clearAll,
    isSelected,
  };

  return (
    <SelectedItemsContext.Provider value={value}>
      {children}
    </SelectedItemsContext.Provider>
  );
}

export function useSelectedItems() {
  const context = useContext(SelectedItemsContext);
  if (context === undefined) {
    throw new Error('useSelectedItems must be used within a SelectedItemsProvider');
  }
  return context;
}