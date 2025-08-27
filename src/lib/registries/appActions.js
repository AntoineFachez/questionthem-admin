// src/lib/registries/action-registry.js
import { toast } from "react-toastify";
import { userApi } from "../api/user-api";

const navigateTo = ({ router, path }) => {
  router.push(path);
};

const showToast = ({ type, message }) => {
  toast[type](message);
};

const submitForm = async ({ endpoint, data }) => {
  try {
    const response = await userApi.post(endpoint, data);
    console.log("Form submitted successfully:", response);
    toast.success("Form submitted!");
  } catch (error) {
    console.error("Form submission failed:", error);
    toast.error("Submission failed!");
  }
};
export const appActions = {
  navigateTo: navigateTo,
  showToast: showToast,
  submitForm: submitForm,
};
