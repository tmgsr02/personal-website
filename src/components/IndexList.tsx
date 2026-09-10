'use client';

import React, { createContext, useContext, useState } from 'react';

interface IndexListContextValue {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

const IndexListContext = createContext<IndexListContextValue>({
  hoveredId: null,
  setHoveredId: () => {},
});

export function useIndexList(): IndexListContextValue {
  return useContext(IndexListContext);
}

interface IndexListProps {
  children: React.ReactNode;
  className?: string;
}

export default function IndexList({ children, className = '' }: IndexListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <IndexListContext.Provider value={{ hoveredId, setHoveredId }}>
      <ul className={className} onMouseLeave={() => setHoveredId(null)}>
        {children}
      </ul>
    </IndexListContext.Provider>
  );
}
