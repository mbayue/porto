import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          border: "4px solid #222222",
          padding: "64px 72px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            color: "#888888",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              border: "2px solid #333333",
              padding: "4px 12px",
              marginRight: 16,
            }}
          >
            GET
          </span>
          <span>https://bayue.my.id/api</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            <span>Building reliable APIs</span>
            <span>and backend systems.</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 32,
              fontSize: 30,
              color: "#888888",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#03b000",
                marginRight: 16,
              }}
            />
            <span>Bayu Erich, backend engineer. Status 200 OK.</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
