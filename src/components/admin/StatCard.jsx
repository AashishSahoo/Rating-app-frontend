import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Icon } from "@iconify/react";

export default function StatCard({
  title,
  value,
  data,
  color = "#3b82f6",
  icon,
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        color: "#1e293b",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              {icon && (
                <Icon icon={icon} width={28} height={28} color={color} />
              )}
              <Typography
                variant="subtitle2"
                sx={{ opacity: 0.8, fontWeight: 500 }}
              >
                {title}
              </Typography>
            </Stack>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#0f172a", fontSize: "1.25rem" }}
            >
              {value}
            </Typography>
          </Box>

          <Box sx={{ width: "55%", height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id={`gradient-${color}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="20%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    fontSize: 12,
                  }}
                  cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 2 }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${color})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
