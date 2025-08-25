// src/lib/registries/action-registry.js
import { toast } from "react-toastify";
import { userApi } from "../api/user-api";

export const actionRegistry = {
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
