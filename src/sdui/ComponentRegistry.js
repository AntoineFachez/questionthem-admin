import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import SearchBarGrouped from "../components/searchBar/SearchBarGrouped";
import Navbar from "../components/navbar/Navbar";
import Card from "../components/card/Card";
import ConfirmDeletionDialog from "../components/dialog/ConfirmDeletionDialog";
import DynamicList from "../components/list/DynamicList";
import DynamicAccordion from "../components/accordion/DynamicAccordion";
import ScrollDialog from "../components/dialog/ScrollDialog";
import Form from "./Form";

export const componentRegistry = {
  //* --- Atoms ---
  "atom.box": ({ children, props }) => <Box {...props}>{children}</Box>,
  "atom.typography": ({ text, ...restOfProps }) => (
    <Typography {...restOfProps}>{text}</Typography>
  ),

  "atom.linkButton": ({ props: { title, navigateTo } }) => (
    <MuiLink
      component={NextLink}
      href={navigateTo}
      color="primary.main"
      underline="none"
      sx={{
        width: "10rem",
        height: "10rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          color: "white",
          backgroundColor: "primary.main",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        },
        backgroundColor: "white",
        borderRadius: "8px",
        border: "2px solid",
        borderColor: "primary.main",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Typography variant="h5">{title}</Typography>
    </MuiLink>
  ),

  "atom.paper": Paper,
  "atom.button": Button,

  //* --- Atoms --- Table
  "atom.table": Table,
  "atom.tableBody": TableBody,
  "atom.tableCell": TableCell,
  "atom.tableContainer": TableContainer,
  "atom.tableHead": TableHead,
  "atom.tableRow": TableRow,
  //* --- Molecules ---
  "molecule.searchBarGrouped": SearchBarGrouped,
  "molecule.formField": TextField,
  "molecule.card": Card,
  //* --- Organisms ---
  "organism.navBar": Navbar,
  "organism.dynamicAccordion": DynamicAccordion,
  "organism.confirmDeletionDialog": ConfirmDeletionDialog,
  "organism.dynamicList": DynamicList,
  "organism.scrollDialog": ScrollDialog,
  "organism.grid": ScrollDialog,
  "organism.grid": Grid,
  "organism.form": Form,
};
