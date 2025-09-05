"use client";

import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('ImageProvider 내에 useImage 사용해야됨');
  }
  return context;
};

export const ImageProvider = ({ children }) => {
  const [imageVersion, setImageVersion] = useState(0);

  const refreshImage = () => {
    setImageVersion(prev => prev + 1);
  };

  return (
    <ImageContext.Provider value={{ imageVersion, refreshImage }}>
      {children}
    </ImageContext.Provider>
  );
};