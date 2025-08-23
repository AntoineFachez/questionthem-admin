// src/configs/pageProps.js
export const titleProps = {
  variant: "h2",
  sx: {
    backgroundColor: "primary.dark",
    borderRadius: "1rem",
    m: 1,
    p: 1,
  },
};
export const containerProps = {
  sx: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "center",
    alignItems: "center",
    m: 0,
    p: 0,
  },
};

export const sharedComponents = {
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Example shadow
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      h1: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        fontSize: "5rem",
        // fontWeight: "100",
        marginBottom: "1rem",
        textAlign: "center",
        // color: "#ffd400",
      },
      h4: {
        fontWeight: "bold",
        marginBottom: "1rem",
        textAlign: "center",
      },
      h5: {
        fontWeight: "bold",
        // marginTop: "2rem",
        marginBottom: "0.5rem",
      },
      body1: { fontWeight: "100", lineHeight: 1.6, padding: "8px" },
      subtitle1: { fontWeight: "100", lineHeight: 1.6, padding: "8px" },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      },
    },
  },

  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: "#4b5563", // gray-700
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "0 1.5rem",
        color: "#e5e7eb",
        borderBottom: "1px solid #4b5563",
      },
      head: {
        fontSize: "0.75rem",
        fontWeight: "medium",
        color: "#d1d5db",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: "#4b5563",
        },
        transition: "background-color 0.2s",
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        "&:hover": {
          // color: "red",
          // You can add other hover styles here, like a background color
          backgroundColor: "rgba(255, 0, 0, 0.1)",
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: { width: "100%", height: "100%", p: 0, m: 0 },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: { width: "100%", height: "100%", p: 0, m: 0 },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        width: "100%",
        height: "100%",
        p: 0,
        m: 0,
        padding: 0,
        marginTop: 0,
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        margin: 0,
        flexShrink: 0,
        borderWidth: 0,
        borderStyle: "solid",
        borderColor: "#ffffff1f",
        borderBottomWidth: "thin",
        marginTop: "2rem",
        marginBottom: "2rem",
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: { width: "3rem", height: "3rem" },
    },
  },
};
