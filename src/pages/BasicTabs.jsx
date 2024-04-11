import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Info from '../components/Info';
import GeneralReport from '../components/GeneralReport';
import IndividualReport from '../components/individualReport';
import MatrixReport from '../components/MatrixReport';

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 'auto', padding: '20px 30px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Informacion" />
          <Tab label="Reporte General" />
          <Tab label="Reporte Individual" />
          <Tab label="Matris Mensual" />
        </Tabs>
      </Box>
      {value === 0 && <Info />}
      {value === 1 && <GeneralReport />}
      {value === 2 && <IndividualReport />}
      {value === 3 && <MatrixReport />}
    </Box>
  );
}