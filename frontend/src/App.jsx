import AppRoutes from "./routes/AppRoutes";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <>
      <AppRoutes />
      <SpeedInsights />
    </>
  );
}

export default App;