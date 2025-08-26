import { MenuItem, MenuList } from "@mui/material";

const SideBar = ({ elements, setter, sx }) => {
  return (
    <MenuList sx={sx}>
      {elements?.map((element, i) => {
        return (
          <MenuItem
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              return setter(element);
            }}
            sx={{}}
          >
            {element?.title}
          </MenuItem>
        );
      })}
    </MenuList>
  );
};
export default SideBar;
