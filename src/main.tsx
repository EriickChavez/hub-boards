import HubBoardScreen from "./components/HubBoardScreen";
import { MonitorWidget } from "./components/MonitorWidget";
// import ReactDOM from "react-dom/client";
// import React from "react";

// if (import.meta.env.VITE_DEBUG_MODE === "true") {
//   const root = ReactDOM.createRoot(
//     document.getElementById("root") as HTMLElement,
//   );
//   root.render(
//     <React.StrictMode>
//       <div
//         style={{ padding: "40px", background: "#f5f5f7", minHeight: "100vh" }}
//       >
//         <HubBoardScreen />
//       </div>
//     </React.StrictMode>,
//   );
// }

// Esto hace que el Hub pueda "ver" tus componentes
(globalThis as any)["com.nexabook.modulo-pro"] = {
  screen: HubBoardScreen,
  HubBoardScreen: HubBoardScreen,
  widget: MonitorWidget,
  MonitorWidget: MonitorWidget,
};
