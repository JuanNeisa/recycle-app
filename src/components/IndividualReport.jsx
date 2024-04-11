import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import { blue } from '@mui/material/colors';

export default function IndividualReport() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FolderIcon sx={{ fontSize: 140, color: blue[500] }} />
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