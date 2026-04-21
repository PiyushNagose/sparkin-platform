import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";

export function ScreenPlaceholder({ eyebrow, title, description, sections }) {
  return (
    <Stack spacing={4}>
      <Box>
        {eyebrow ? <Chip label={eyebrow} color="secondary" sx={{ mb: 2, fontWeight: 700 }} /> : null}
        <Typography variant="h2" sx={{ maxWidth: 720, mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
          {description}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid key={section} size={{ xs: 12, md: 6, xl: 4 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  {section}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This area is reserved for the exact UI reconstruction from the approved reference screens.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained">Primary Action</Button>
        <Button variant="outlined">Secondary Action</Button>
      </Stack>
    </Stack>
  );
}

