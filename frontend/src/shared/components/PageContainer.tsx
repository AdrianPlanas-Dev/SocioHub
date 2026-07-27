
import { Box, Typography } from "@mui/material";

interface PageContainerProps {
  title: string;
  children?: React.ReactNode;
}

export default function PageContainer({
  title,
  children,
}: PageContainerProps) {
  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}