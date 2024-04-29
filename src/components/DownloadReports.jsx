import React, { useState, useEffect } from "react";
import Papa from "papaparse";

//Utils
import { generateGlobalInformation } from "../utils/ProcessingFile.utils";
import { downloadZipFile } from "../utils/downloadReport.utils";
import { removeBlankPropertiesFromObject } from "../utils/ProcessingFile.utils";

//Material
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import GridOnIcon from "@mui/icons-material/GridOn";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const VALID_EXTENSION = "text/csv";

export default function DownloadReports({ data }) {
  const [date, setDate] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [materialsCode, setMaterialsCode] = useState(null);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  useEffect(() => {
    if (data !== null) {
      const materials = Object.keys(data.result[0]).filter(
        (propiedad) => propiedad !== propiedad.toUpperCase()
      );
      setMaterials(Object.keys(materials).length);
    }
  }, [data]);

  const materialCodeCSV = (event) => {
    const file = event.target.files[0];
    if (file.type !== VALID_EXTENSION) {
      setMaterialsCode(null);
      return;
    } else {
      new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: false,
          complete: (result) =>
            resolve(
              result.data
                .filter((row) => row["Material"] !== "")
                .map((obj) => removeBlankPropertiesFromObject(obj))
            ),
          error: (error) => {
            console.error("Error processing CSV file:", error);
            setMaterialsCode(null);
          },
        });
      }).then((result) => {
        setMaterialsCode(Object.fromEntries(result));
      });
    }
  };

  const downloadMatrix = () => {
    const selectedDate = new Date(date.$d);
    const procesingInfo = generateGlobalInformation(data, selectedDate);

    //Download Reports
    downloadZipFile(procesingInfo, selectedDate, materialsCode);
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
              <div style={{ display: "grid" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={"Selecciona Mes y Año"}
                    views={["year", "month"]}
                    value={date}
                    onChange={(date) => setDate(date)}
                  />
                </LocalizationProvider>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  onChange={materialCodeCSV}
                >
                  Codigos de Materiales
                  {materialsCode ? "🟢" : "🔴"}
                  <VisuallyHiddenInput type="file" />
                </Button>
              </div>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                size="small"
                onClick={downloadMatrix}
                disabled={!!!date || !!!materialsCode}
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
