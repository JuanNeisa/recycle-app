import React, { useState } from 'react';
import BasicTabs from './pages/BasicTabs';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function App() {
  const [csvFile, setCsvFile] = useState(null);

  const handleChange = (event, newValue) => {
    if(event.target.files[0].type === 'text/csv') setCsvFile(event.target.files[0]);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1 style={{ marginBottom: '0' }}>♻️ Recycle App ♻️</h1>
        <h5 style={{ margin: '0' }}>Version 2.0.0</h5>
      </div>
      <Stack spacing={2} direction="row" alignItems={'center'}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          onChange={handleChange}>
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
        <h4>{csvFile?.name || 'Sin archivo CSV valido...'}</h4>
      </Stack>
      <BasicTabs disabledOptions={!!csvFile} />
    </>
  );
}

export default App;