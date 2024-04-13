import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InfoIcon from '@mui/icons-material/Info';
import { grey } from '@mui/material/colors';


export default function Info() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <InfoIcon sx={{ fontSize: 140, color: grey[500] }} />
        </Grid>
        <Grid item xs={8}>
            <div>
                <ul>
                    <li>Solo se pueden subir archivos con extencion CSV.</li>
                    <li>Si no se selecciona el numero de partes, por defecto seran 8. Para que sea diferente se debe seleccionar antes de cargar el archivo CSV.</li>
                </ul>
            </div>
        </Grid>
      </Grid>
    </Box>
  );
}