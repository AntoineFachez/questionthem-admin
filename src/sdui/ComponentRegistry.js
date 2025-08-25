import {
  Box,
  Button,
  CardActions,
  CardHeader,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  MenuItem,
} from "@mui/material";
import Card from "../components/card/Card";
import ConfirmDeletionDialog from "../components/dialog/ConfirmDeletionDialog";
import Controls from "../components/controls/Controls";
import CustomIconButton from "../components/button/CustomIconButton";
import DetailView from "../components/detailView/DetailView";
import DynamicAccordion from "../components/accordion/DynamicAccordion";
import DynamicList from "../components/list/DynamicList";
import DynamicTable from "../components/table/DynamicTable";
import ExpandMore from "../components/button/ExpandMore";
import Form from "../components/form/Form";
import Header from "../components/title/Title";
import KebabMenu from "../components/menus/KebabMenu";
import Navbar from "../components/navbar/Navbar";
import SearchBarGrouped from "../components/searchBar/SearchBarGrouped";
import ScrollDialog from "../components/dialog/ScrollDialog";

const Standin = ({ children }) => {
  return <Box>{children}</Box>;
};

export const componentRegistry = {
  //* --- ATOMS ---
  "atom.avatar": Avatar,
  "atom.box": ({ children, ...props }) => <Box {...props}>{children}</Box>,
  "atom.button": Button,
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
  "atom.expandMoreButton": ExpandMore,
  "atom.iconButton": CustomIconButton,
  "atom.menuItem": MenuItem,
  "atom.paper": Paper,
  "atom.typography": ({ text, ...restOfProps }) => (
    <Typography {...restOfProps}>{text}</Typography>
  ),
  // --- Table ---
  "atom.tableCell": TableCell,
  "atom.tableContainer": TableContainer,
  // --- Card ---
  "atom.cardMedia": CardMedia,
  "atom.collapse": Collapse,

  //* --- MOLECULES ---
  // --- Card ---
  "molecule.cardActions": CardActions,
  "molecule.cardContent": CardContent,
  "molecule.cardHeader": CardHeader,
  // --- Table ---
  "molecule.tableRow": TableRow,
  // --- Grid ---
  "molecule.grid": Grid,
  // --- Misc ---
  "molecule.formField": ({ ...props }) => <TextField {...props} />,
  "molecule.searchBarGrouped": SearchBarGrouped,

  //* --- ORGANISMS ---
  "organism.card": Card,
  "organism.confirmDeletionDialog": ConfirmDeletionDialog,
  "organism.controls": Controls,
  "organism.dynamicAccordion": DynamicAccordion,
  "organism.dynamicList": ({ data, itemInFocus, blueprint }) => (
    <DynamicList data={data} itemInFocus={itemInFocus} blueprint={blueprint} />
  ),
  "organism.form": Form,
  "organism.kebabMenu": KebabMenu,
  "organism.navBar": Navbar,
  "organism.pageHeader": ({ title, ...restOfProps }) => {
    const headerProps = {
      string: title,
      ...restOfProps,
    };

    return <Header props={headerProps} />;
  },
  "organism.pagination": DynamicList,
  "organism.scrollDialog": ScrollDialog,
  "organism.table": Table,
  "organism.tableBody": TableBody,
  "organism.tableHead": TableHead,

  //* --- TEMPLATES ---
  "template.dashboard": Card,
  "template.detail": DetailView,
  // "template.form": Card,
  "template.grid": Grid,
  "template.listView": Standin,
  "template.table": DynamicTable,
};
