import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import servicesReducer from "./slices/serviceSlice";
import projectsReducer from "./slices/projectSlice";
import featuresReducer from "./slices/featureSlice";
import galleryReducer from "./slices/gallerySlice";
import contactReducer from "./slices/contactSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    features: featuresReducer,
     services: servicesReducer,
      projects: projectsReducer,
      gallery: galleryReducer,
      contact: contactReducer,
  },
});
