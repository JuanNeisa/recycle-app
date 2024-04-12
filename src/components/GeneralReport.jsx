import React, { useEffect, useState } from "react";

//Utils
import {
  splitingUnitsPerMaterial,
  downloadReport,
} from "../utils/ProcessingFile.utils";

//Material
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";
import { grey } from "@mui/material/colors";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function GeneralReport({ data }) {
  const [materials, setMaterials] = useState(null);
  useEffect(() => {
    if (data !== null) {
      const { CEDULA, RECICLADOR, NUMACRO, VEHICULO, ...materials } =
        data.result[0];
      setMaterials(Object.keys(materials).length);
    }
  }, [data]);

  const downloadReportInComponent = () => {
    const reportInfo = data.result.map((person) => splitingUnitsPerMaterial(person, data.numberOfParts)).flat();
    downloadReport(reportInfo, 'ReporteGeneral')
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
          <FolderIcon sx={{ fontSize: 140, color: grey[500] }} />
        </Grid>
        <Grid item xs={8}>
          <Card sx={{ minWidth: 275 }} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                Reporte
              </Typography>
              <Typography color="text.secondary">
                {data?.result?.length} Recicladores procesados
              </Typography>
              <Typography color="text.secondary">
                {materials} Materiales x reciclador
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                size="small"
                disabled={!!!data}
                onClick={downloadReportInComponent}
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
