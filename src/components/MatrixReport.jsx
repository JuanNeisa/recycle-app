import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import GridOnIcon from '@mui/icons-material/GridOn';
import { grey } from '@mui/material/colors';


export default function MatrixReport() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GridOnIcon sx={{ fontSize: 140, color: grey[500] }} />
        </Grid>
        <Grid item xs={8}>
            <div>
                <ul>
                    <li>Solo se pueden subir archivos con extencion CSV.</li>
                </ul>
            </div>
        </Grid>
      </Grid>
    </Box>
  );
}