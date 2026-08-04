import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

export default function SectionCard({
  title,
  children,
}: SectionCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        mb: 3,
      }}
    >
      <CardContent>

        <Typography
          variant="subtitle2"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          {title}
        </Typography>

        {children}

      </CardContent>
    </Card>
  );
}