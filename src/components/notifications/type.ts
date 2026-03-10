export type NotificationType = {
  id: string;
  type: string;
  title?: React.ReactNode;
  message?: React.ReactNode;
  timeOut?: number;
  customClassName?: string;
  filled?: boolean; // whether style is "filled" (solid background)
  onClick?: () => void;
  priority?: boolean;
};
