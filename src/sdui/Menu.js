const { Box, Button } = require("@mui/material");

const Menu = ({ buttons }) => {
  return (
    <>
      {buttons.map((button, i) => {
        return (
          <Button
            key={i}
            onClick={button.props.action}
            variant={button.props.variant}
          >
            {button.props.label}
          </Button>
        );
      })}
    </>
  );
};
export default Menu;
