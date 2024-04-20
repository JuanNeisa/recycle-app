import React, { useState } from "react";

// Utils
import Info from "../components/Info";
import DownloadReports from "../components/DownloadReports";

// Material
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function BasicTabs({ processingData, validTabs }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "auto", padding: "20px 30px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Informacion" />
          <Tab label="Descarga de reportes" disabled={!validTabs} />
        </Tabs>
      </Box>
      {value === 0 && <Info />}
      {value === 1 && <DownloadReports data={processingData} />}
    </Box>
  );
}
