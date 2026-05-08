import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 40,
        background: "#563BE7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -14,
          top: "50%",
          transform: "translateY(-50%)",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#ffffff",
        }}
      />
      <span
        style={{
          color: "#ffffff",
          fontSize: 110,
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          lineHeight: 1,
          marginRight: 6,
        }}
      >
        S
      </span>
    </div>,
    { ...size }
  );
}