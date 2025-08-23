// src/components/formComponents.js
import DynamicForm from "../../app/(features)/form/DynamicForm";
import DataBaseOverview from "../../app/(features)/dataBase/DataBaseOverview";
// import AnotherForm from "./form/AnotherForm";
// import SomeOtherWidget from "./widgets/SomeOtherWidget";

const componentMap = {
  dataBaseOverview: DataBaseOverview,
  dynamicForm: DynamicForm,
  // anotherForm: AnotherForm,
  // someOtherWidget: SomeOtherWidget,
};

export default componentMap;
