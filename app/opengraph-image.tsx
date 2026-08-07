import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Francisco Rissone — Network Engineer | CCNA Certified"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #0c1524 0%, #123044 55%, #0e4a52 100%)",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#eaf6f6" }}>Francisco Rissone</div>
        <div style={{ fontSize: 32, color: "#5fd4c8", letterSpacing: 2, marginTop: 16 }}>
          Network Engineer · CCNA Certified
        </div>
        <div style={{ marginTop: 40, width: 120, height: 4, borderRadius: 4, background: "#5fd4c8", opacity: 0.7 }} />
      </div>
    ),
    { ...size },
  )
}
