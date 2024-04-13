import React, { useState, useEffect } from "react";

//Utils
import { setInformation } from '../utils/Matrix.utils'

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

export default function MatrixReport({ data }) {
  const [date, setDate] = useState(null);
  const downloadMatrix = () => {
    const newDate = new Date(date.$d);
    setInformation(data, newDate)
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
                Reporte
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
              <Button variant="outlined" size="small" onClick={downloadMatrix}>
                Descargar Reporte
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
