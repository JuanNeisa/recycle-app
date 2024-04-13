import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Info from '../components/Info';
import GeneralReport from '../components/GeneralReport';
import IndividualReport from '../components/individualReport';
import MatrixReport from '../components/MatrixReport';

export default function BasicTabs({processingData, validTabs}) {
  const [value, setValue] = useState(3);

  const handleChange = (event, newValue) => { 
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 'auto', padding: '20px 30px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Informacion" />
          <Tab label="Reporte General" disabled={!validTabs}/>
          <Tab label="Reporte Individual" disabled={!validTabs}/>
          <Tab label="Matris Mensual"/>
        </Tabs>
      </Box>
      {value === 0 && <Info />}
      {value === 1 && <GeneralReport data={processingData}/>}
      {value === 2 && <IndividualReport data={processingData}/>}
      {value === 3 && <MatrixReport data={processingData}/>}
    </Box>
  );
}