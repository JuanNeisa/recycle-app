import React, { useEffect, useState } from 'react';
import BasicTabs from "./pages/BasicTabs";
import ProcessingFile from "./components/ProcessingFile";

function App() {
  const [processingFileState, setProcessingFile] = useState(null);
  const [BasicTabsState, setBasicTabs] = useState(null);

  useEffect(() => {
    if (processingFileState !== null) {
      setBasicTabs(processingFileState);
    }
  }, [processingFileState])

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}>
        <h1 style={{ marginBottom: "0" }}>♻️ Recycle App ♻️</h1>
        <h5 style={{ margin: "0" }}>Version 2.1.0</h5>
      </div>
      <ProcessingFile setData={setProcessingFile} />
      <BasicTabs processingData={BasicTabsState} validTabs={!!BasicTabsState}/>
    </>
  );
}

export default App;
