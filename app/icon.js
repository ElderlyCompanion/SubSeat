import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
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
          right: -5,
          top: "50%",
          transform: "translateY(-50%)",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#ffffff",
        }}
      />
      <span
        style={{
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          lineHeight: 1,
          marginRight: 2,
        }}
      >
        S
      </span>
    </div>,
    { ...size }
  );
}