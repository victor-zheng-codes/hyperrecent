export const LoadingSpinner = ({
  height,
  strokeWidth = 2,
  color,
  isCentered,
}: {
  height: number;
  strokeWidth?: number;
  color?: string;
  isCentered?: boolean;
}) => {
  return (
    <div className={`flex ${isCentered ? "items-center justify-center" : ""}`}>
      <div
        className={`loading-spinner`}
        style={{
          borderTopColor: `${color || `rgb(var(--cl-foreground))`}`,
          borderTopWidth: `${strokeWidth}px`,
          borderRightWidth: `${strokeWidth}px`,
          height: `${height}px`,
          width: `${height}px`,
        }}
      ></div>
    </div>
  );
};
