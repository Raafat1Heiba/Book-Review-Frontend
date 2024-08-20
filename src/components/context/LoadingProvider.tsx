import { createContext, useState } from "react";

const LoadingContext = createContext({});

export const LoadingProvider = ({ children }: any) => {
  const [loading, setloadig] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setloadig }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
