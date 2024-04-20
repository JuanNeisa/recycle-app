import React, { useState, useEffect } from "react";

//Utils
import { generateGlobalInformation } from "../utils/ProcessingFile.utils";
import { downloadZipFile } from "../utils/downloadReport.utils";

//Material
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import GridOnIcon from "@mui/icons-material/GridOn";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DownloadReports({ data }) {
  const [date, setDate] = useState(null);
  const [materials, setMaterials] = useState(null);
  useEffect(() => {
    if (data !== null) {
      const { CEDULA, RECICLADOR, NUMACRO, VEHICULO, ...materials } =
        data.result[0];
      setMaterials(Object.keys(materials).length);
    }
  }, [data]);

  const downloadMatrix = () => {
    const selectedDate = new Date(date.$d);
    const procesingInfo = generateGlobalInformation(data, selectedDate);

    //Download Reports
    downloadZipFile(procesingInfo, selectedDate);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} style={{ padding: "20px" }}>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GridOnIcon sx={{ fontSize: 140, color: grey[500] }} />
        </Grid>
        <Grid item xs={8}>
          <Card sx={{ minWidth: 275 }} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div" marginBottom={"5px"}>
                Reportes
              </Typography>
              <Typography color="text.secondary">
                {data?.result?.length} Recicladores procesados
              </Typography>
              <Typography color="text.secondary" marginBottom={"10px"}>
                {materials} Materiales x reciclador
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={"Selecciona Mes y Año"}
                  views={["year", "month"]}
                  value={date}
                  onChange={(date) => setDate(date)}
                />
              </LocalizationProvider>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                size="small"
                onClick={downloadMatrix}
                disabled={!!!date}
              >
                Descargar Reporte
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
