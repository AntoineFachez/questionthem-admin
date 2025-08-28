// src/configs/pageProps.js
export const titleProps = {
  variant: "h2",
  sx: {
    width: "100%",
    // borderRadius: "1rem",
    // m: 1,
    // p: 1,
    textAlign: "center",
    backgroundColor: "primary.dark",
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

const randomDeg = Math.random() * 360;
export const sharedComponents = {
  MuiGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
        backgroundColor: theme.palette.primary.dark,
      }),
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        "&:hover": { backgroundColor: "#33343320" },
      },
    },
  },

  // MuiPaper: {
  //   styleOverrides: {
  //     root: {
  //       borderRadius: "16px",
  //       padding: "24px",
  //       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Example shadow
  //     },
  //   },
  // },
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
  MuiMenu: {
    styleOverrides: {
      root: {
        // padding: 0,
        // margin: 0,
        display: "flex",
        flexFlow: "row nowrap",
        "& >*": {
          display: "flex",
          flexFlow: "row nowrap",
          borderRadius: "5px",
          // border: "1px blue solid",
          padding: 0,
          margin: 0,
          backgroundColor: "transparent",
        },
      },
    },
  },
  // MuiMenuItem: {
  //   styleOverrides: {
  //     root: ({ theme }) => ({
  //       backgroundColor: theme.palette.primary.alpha,
  //       // backgroundColor: "#333433cc",
  //     }),
  //   },
  // },

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
  MuiList: {
    styleOverrides: {
      root: {
        height: "100%",
        overflow: "scroll",
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
  MuiListItemText: {
    styleOverrides: {
      root: ({ theme }) => ({
        // backgroundColor: theme.palette.primary.alpha,
        // backgroundColor: "#333433cc",
      }),
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
  // MuiDataGrid: {
  //   styleOverwrites: {
  //     root: {
  //       border: "none",
  //       outline: "none",
  //       borderRadius: 0,
  //       borderTopLeftRadius: 0,
  //       borderTopRightRadius: 0,
  //       "& .activeRow": {
  //         border: "none",
  //         outline: "none",
  //         backgroundColor: "steelblue",
  //         "&:hover": {
  //           /* Nest the hover pseudo-class here */
  //           backgroundColor:
  //             "steelblue" /* Change the hover color to dodgerblue */,
  //         },
  //         "& > *": {
  //           outline: "none",
  //           border: "none",
  //         },
  //       },
  //       "& .inactiveRow": {
  //         backgroundColor: "grey",
  //         "&:hover": {
  //           backgroundColor: "green" /* Change the hover color to dodgerblue */,
  //         },
  //         "& > *": {},
  //       },
  //     },
  //   },
  // },

  MuiDataGrid: {
    styleOverrides: {
      root: {
        "& .MuiDataGrid-toolbar": {
          displa: "flex",
          justifyContent: "space-between",
          "&:hover": { backgroundColor: "#333433" },
        },
        //       border: "none",
        //       "& .MuiDataGrid-topContainer": {
        //         // height: "100%",
        //         color: "#fff",
        //         backgroundColor: "#333433",
        //       },
        //       "& .MuiDataGrid-main > *": {
        //         // height: "100%",
        //         borderTopLeftRadius: 0,
        //         borderTopRightRadius: 0,
        //         // backgroundColor: "red",
        //       },
        // "& .MuiDataGrid-virtualScroller": {
        //   height: "100%",
        //   scrollbarWidth: "auto",
        // },
        //       // "& .MuiDataGrid-virtualScroller > *": { height: "100%" },
        // "& .MuiDataGrid-scrollbar": {
        //   // height: "100%",
        //   position: "relative",
        //   scrollbarWidth: "auto",
        // },
        //       "& .MuiDataGrid-virtualScrollerContent": {
        //         height: "100%",
        //       },
        //       "& .MuiDataGrid-root--densityComfortable": {
        //         border: "none",
        //         outline: "none",
        //       },
        //       "& .MuiDataGrid-withBorderColor > *": {
        //         border: "none",
        //         outline: "none",
        //       },
        //       "& .MuiDataGrid-columnHeader": {
        //         // width: "100%",
        //         color: "#fff",
        //         backgroundColor: "#333433",
        //       },
        //       "& .MuiDataGrid-filler": {
        //         // width: "100%",
        //         // height: "1rem",
        //         color: "#fff",
        //         backgroundColor: "#fff",
        //         "& >*": {
        //           // height: "1rem",
        //         },
        //       },
        //       "& .MuiDataGrid-columnSeparator > *": {
        //         // width: "100%",
        //         color: "#fff",
        //         backgroundColor: "steelblue",
        //       },
        //       "& .MuiDataGrid-columnHeaderTitleContainer": {
        //         display: "flex",
        //         justifyContent: "space-between",
        //         alignItems: "center",
        //       },
        //       "& .MuiDataGrid-columnHeaderTitleContainer > svg": {
        //         // width: "100%",
        //         color: "#fff",
        //         backgroundColor: "#333433",
        //         "&:hover": {
        //           color: "white",
        //           backgroundColor: "steelblue",
        //         },
        //       },
        //       "& .MuiDataGrid-iconButtonContainer > *": {
        //         width: "1rem",
        //         height: "1rem",
        //         color: "white",
        //         backgroundColor: "steelblue",
        //       },
        //       "& .MuiDataGrid-menuIcon, & .MuiDataGrid-menuIcon > *": {
        //         border: "none",
        //         color: "#fff",
        //         outline: "none",
        //       },
        //       "& .MuiDataGrid-cell": {
        //         color: "#aaa",
        //         outline: "none",
        //         userSelect: "none",
        //       },
        //       "& .MuiDataGrid-cell:active": {
        //         outline: "none",
        //       },
        //       "& .MuiDataGrid-cell:focus": {
        //         color: "#fff",
        //         outline: "none",
        //       },
        //       "& .MuiDataGrid-cell:hover": {
        //         color: "#fff",
        //       },
      },
    },
  },
};
