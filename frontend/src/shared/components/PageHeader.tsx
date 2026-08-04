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
    <Box mb={4}>
      <Typography
        variant="h4"
        fontWeight="bold"
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          color="text.secondary"
          mt={1}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}