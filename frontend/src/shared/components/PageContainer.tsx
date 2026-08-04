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

      <Box mt={50}>
        {children}
      </Box>
    </Box>
  );
}