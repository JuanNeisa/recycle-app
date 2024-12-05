import React, { useEffect, useState } from "react";
import BasicTabs from "./pages/BasicTabs";

function App() {
  const [processingFileState, setProcessingFile] = useState(null);
  const [BasicTabsState, setBasicTabs] = useState(null);

  useEffect(() => {
    if (processingFileState !== null) {
      setBasicTabs(processingFileState);
    }
  }, [processingFileState]);

  return (
    <BasicTabs processingData={BasicTabsState} validTabs={!!BasicTabsState} />
  );
}

export default App;
