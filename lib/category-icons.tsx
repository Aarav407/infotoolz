import {
  Monitor,
  Cpu,
  HardDrive,
  Laptop,
  Keyboard,
  Wifi,
  Box,
  Zap,
  MemoryStick,
  CircuitBoard,
  LayoutGrid,
  Network,
  Server,
} from "lucide-react";

export const categoryIconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu className="h-4 w-4 shrink-0" />,
  gpu: <Monitor className="h-4 w-4 shrink-0" />,
  motherboard: <CircuitBoard className="h-4 w-4 shrink-0" />,
  memory: <MemoryStick className="h-4 w-4 shrink-0" />,
  storage: <HardDrive className="h-4 w-4 shrink-0" />,
  ssd: <HardDrive className="h-4 w-4 shrink-0" />,
  hdd: <HardDrive className="h-4 w-4 shrink-0" />,
  monitor: <Monitor className="h-4 w-4 shrink-0" />,
  psu: <Zap className="h-4 w-4 shrink-0" />,
  cabinet: <Box className="h-4 w-4 shrink-0" />,
  laptop: <Laptop className="h-4 w-4 shrink-0" />,
  peripheral: <Keyboard className="h-4 w-4 shrink-0" />,
  network: <Wifi className="h-4 w-4 shrink-0" />,
  switch: <Network className="h-4 w-4 shrink-0" />,
  server: <Server className="h-4 w-4 shrink-0" />,
  desktop: <Monitor className="h-4 w-4 shrink-0" />,
};

export const allProductsIcon = <LayoutGrid className="h-4 w-4 shrink-0" />;
