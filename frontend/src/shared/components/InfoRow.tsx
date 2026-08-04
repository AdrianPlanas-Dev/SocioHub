import { Box, Typography } from "@mui/material";

import type { ReactNode } from "react";

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.2,
      }}
    >
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography fontWeight={500}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}