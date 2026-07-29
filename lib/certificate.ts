// Генерация именного сертификата профориентатора (SVG) с QR-кодом
// для проверки подлинности. Скачивается как файл на клиенте.

import QRCode from "qrcode";

export interface CertificateData {
  name: string;
  school: string;
  certId: string;
  date: string;
  verifyUrl: string;
}

export async function generateCertificateSvg(
  d: CertificateData
): Promise<string> {
  // QR как data-URL (PNG), встраивается в SVG
  const qr = await QRCode.toDataURL(d.verifyUrl, {
    margin: 0,
    width: 240,
    color: { dark: "#134e4a", light: "#ffffff" },
  });

  const TEAL = "#0d9488";
  const INK = "#1c1917";
  const MUTED = "#a8a29e";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1123" height="794" viewBox="0 0 1123 794">
  <rect width="1123" height="794" fill="#ffffff"/>
  <rect x="28" y="28" width="1067" height="738" rx="18" fill="none" stroke="${INK}" stroke-width="5"/>
  <rect x="44" y="44" width="1035" height="706" rx="12" fill="none" stroke="${TEAL}" stroke-width="2.5"/>

  <!-- Знак-компас -->
  <g transform="translate(561.5 132)">
    <circle r="44" fill="none" stroke="${INK}" stroke-width="6"/>
    <g transform="rotate(45)">
      <polygon points="0,-30 15,0 0,30 -15,0" fill="none" stroke="${TEAL}" stroke-width="6" stroke-linejoin="round"/>
    </g>
  </g>

  <text x="561.5" y="240" text-anchor="middle" font-family="Georgia, serif" font-size="46" letter-spacing="14" fill="${INK}" font-weight="bold">СЕРТИФИКАТ</text>
  <text x="561.5" y="278" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" letter-spacing="3" fill="${MUTED}">ПЕДАГОГА-ПРОФОРИЕНТАТОРА ПЛАТФОРМЫ «ПРОФОРИЕНТАТОР»</text>

  <text x="561.5" y="348" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" fill="${INK}">Настоящим подтверждается, что</text>
  <text x="561.5" y="412" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="${TEAL}" font-weight="bold">${d.name}</text>
  <line x1="280" y1="436" x2="843" y2="436" stroke="${MUTED}" stroke-width="1.5"/>
  <text x="561.5" y="478" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" fill="${INK}">${d.school}</text>

  <text x="561.5" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${INK}">успешно прошёл(ла) полную программу подготовки профориентатора:</text>
  <text x="561.5" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${INK}">обучающие курсы, практику консультирования и аттестационный тест</text>

  <!-- Подпись и дата -->
  <g transform="translate(150 660)">
    <path d="M0 0 q22 -20 42 0 q18 16 38 -6" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-20" y1="24" x2="200" y2="24" stroke="${MUTED}" stroke-width="1.5"/>
    <text x="90" y="46" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="${MUTED}">Руководитель платформы</text>
  </g>
  <g transform="translate(430 660)">
    <text x="90" y="12" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" fill="${INK}">${d.date}</text>
    <line x1="0" y1="24" x2="200" y2="24" stroke="${MUTED}" stroke-width="1.5"/>
    <text x="90" y="46" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="${MUTED}">Дата выдачи</text>
  </g>

  <!-- QR и проверка подлинности -->
  <g transform="translate(858 588)">
    <rect x="-14" y="-14" width="148" height="148" rx="10" fill="none" stroke="${MUTED}" stroke-width="1.5"/>
    <image href="${qr}" width="120" height="120"/>
  </g>
  <text x="931" y="756" text-anchor="middle" font-family="monospace" font-size="12" fill="${MUTED}">${d.verifyUrl}</text>

  <text x="150" y="756" font-family="monospace" font-size="13" fill="${MUTED}">ID: ${d.certId}</text>
</svg>`;
}

export function downloadCertificate(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
