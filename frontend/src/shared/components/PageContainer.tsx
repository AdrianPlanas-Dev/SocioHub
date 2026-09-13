import { Box } from "@mui/material";
import PageHeader from "./PageHeader";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  children,
}: PageContainerProps) {
  return (
    <Box>
      <PageHeader
        title={title}
        subtitle={subtitle}
      />

      <Box
        sx={{
          mt: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}