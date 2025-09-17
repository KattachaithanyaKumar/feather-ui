// Import CSS so Vite extracts it to dist
import "./styles/feather-theme.css";

// src/index.ts
export { default as Button } from "./components/Button";
export { default as Loader } from "./helperComponents/Loader";
export { default as Input } from "./components/Input";
export { default as Form } from "./components/Form";
export { setFeatherTheme } from "./theme/setTheme";
