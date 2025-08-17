//src/app/actions.js

export const handleSetUiContext = (props) => {
  const { item, setActiveUiContext, setActiveStep } = props;
  setActiveUiContext(item.href);
  setActiveStep(item);
};
