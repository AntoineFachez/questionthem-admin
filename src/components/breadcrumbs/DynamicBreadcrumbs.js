import * as React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export default function BasicBreadcrumbs({ steps }) {
  const pathname = usePathname();
  const currentPath = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/overview">
        Features
      </Link>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        // This is a dynamic path based on the href in your data
        const path = step.href;

        return isLast ? (
          <Typography key={index} color="text.primary">
            {step.header}
          </Typography>
        ) : (
          <Link key={index} underline="hover" color="inherit" href={path}>
            {step.header}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
