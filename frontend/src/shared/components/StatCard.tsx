import { Card, CardContent, Typography, Box } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        height: "100%",
        transition: "0.25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="subtitle1"
            color="text.secondary"
          >
            {title}
          </Typography>

          {icon}
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          mt={3}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}