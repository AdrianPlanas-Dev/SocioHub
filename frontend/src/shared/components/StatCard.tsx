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
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(0,0,0,.08)",
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

          <Box
  sx={{
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {icon}
</Box>
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