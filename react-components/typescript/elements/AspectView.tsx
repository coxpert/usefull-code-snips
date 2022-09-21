/** @jsx jsx */
import { jsx } from "@emotion/react";
import { ReactNode } from "react";

export default function AspectView({
  children,
  ratio = 1,
}: {
  children: ReactNode;
  ratio: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: `${100 / ratio}%`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
