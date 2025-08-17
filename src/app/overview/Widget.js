// app/features/Widget.js
import React from "react";

import DynamicList from "../../components/list/List";
import Features from "./Overview";

export default function Widget({ data, activeStep, handleSetUiContext }) {
  const renderContent = () => {
    switch (activeStep.href) {
      default:
        return <Features data={data} />;
    }
  };

  return <>{renderContent()}</>;
}
