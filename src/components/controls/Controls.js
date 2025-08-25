import { Box } from "@mui/material";
import SduiRenderer from "../../sdui/SduiRenderer";

const Controls = (props) => {
  const { context, widgetProps } = props;
  const buttonConfigurations = widgetProps.buttonConfigurations;
  const buttons = buttonConfigurations[context] || buttonConfigurations.default;
  console.log("buttons", widgetProps);

  return (
    <Box sx={{ display: "flex", gap: 0, padding: 0 }}>
      {buttons.map((buttonInfo, index) => (
        <SduiRenderer
          key={index}
          blueprint={{
            type: "atom.button",
            props: {
              variant: "outlined",
              sx: { textTransform: "capitalize", ...buttonInfo.sx },
              children: buttonInfo.label,
            },
            action: buttonInfo.action,
          }}
        />
      ))}
    </Box>
  );
};

export default Controls;
