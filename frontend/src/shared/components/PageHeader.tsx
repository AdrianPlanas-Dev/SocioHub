import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold" }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}