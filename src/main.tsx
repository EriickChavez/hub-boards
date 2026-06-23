import { MonitorScreen } from "./components/MonitorScreen";
import { MonitorWidget } from "./components/MonitorWidget";

// Esto hace que el Hub pueda "ver" tus componentes
(globalThis as any)["com.nexabook.modulo-pro"] = {
  screen: MonitorScreen,
  widget: MonitorWidget,
};
