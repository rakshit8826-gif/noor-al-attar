import { ImageResponse } from 'next/og';
export const runtime = 'edge';
/** Auto-generated Open Graph card: /api/og?title=... */
export async function GET(req: Request) {
  const title = new URL(req.url).searchParams.get('title') || 'The Essence of the Orient';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#FAF7F2,#EFE6D6)', border: '14px solid #C9A961', color: '#2A2420' }}>
        <div style={{ fontSize: 120, color: '#B08F4A' }}>نور العطار</div>
        <div style={{ fontSize: 64, marginTop: 8, fontWeight: 700 }}>Noor Al Attar</div>
        <div style={{ fontSize: 34, marginTop: 24, color: '#755C2B', maxWidth: 900, textAlign: 'center' }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
