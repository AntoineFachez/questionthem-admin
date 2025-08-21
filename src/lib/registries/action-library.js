// src/actions/action-registry.js

// Import necessary libraries or utilities
import { toast } from "react-toastify";
import { userApi } from "../api/user-api";

export const actionRegistry = {
  // Now accepts 'router' as a parameter
  navigateTo: ({ router, path }) => {
    router.push(path);
  },

  showToast: ({ type, message }) => {
    toast[type](message);
  },

  submitForm: async ({ endpoint, data }) => {
    try {
      const response = await userApi.post(endpoint, data);
      console.log("Form submitted successfully:", response);
      toast.success("Form submitted!");
    } catch (error) {
      console.error("Form submission failed:", error);
      toast.error("Submission failed!");
    }
  },
};
