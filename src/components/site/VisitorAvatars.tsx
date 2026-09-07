/**
 * Empat wajah bergaya manga, digambar sebagai SVG inline.
 *
 * Bukan karakter yang sungguhan ada: memakai artwork berlisensi di portofolio
 * profesional bukan pilihan, dan CSP situs ini juga memblokir gambar dari
 * domain luar. Digambar sendiri berarti tidak ada request eksternal sama sekali.
 *
 * Yang membedakan keempatnya hanya siluet rambut — pada 28 piksel, detail lain
 * tidak bertahan.
 */

const HAIR = [
  // Bob dengan poni rata
  "M20 8c-7 0-11 4.4-11 11.2 0 1.6.2 3 .5 4.2l1.6-.6c-.3-1.4-.4-2.6-.4-3.8 0-1.6.2-3 .7-4 2.4 1.6 5.6 2.4 8.6 2.4s6.2-.8 8.6-2.4c.5 1 .7 2.4.7 4 0 1.2-.1 2.4-.4 3.8l1.6.6c.3-1.2.5-2.6.5-4.2C31 12.4 27 8 20 8z",
  // Panjang, belah tengah
  "M20 8c-7 0-10.8 4.4-10.8 11 0 4.6.6 9 1.5 12.4l2.4-.8c-.8-3.2-1.3-7-1.3-10.6 0-2 .3-3.6.9-4.8 2.2 1.6 5.1 2.4 7.3 2.4s5.1-.8 7.3-2.4c.6 1.2.9 2.8.9 4.8 0 3.6-.5 7.4-1.3 10.6l2.4.8c.9-3.4 1.5-7.8 1.5-12.4C30.8 12.4 27 8 20 8z",
  // Runcing berantakan
  "M20 7c-7 0-11 4.6-11 11.4 0 1.4.1 2.6.4 3.6l1.4-.8c-.2-1.2-.2-2.4 0-3.4l2.2 2.6.5-4.4 2.4 2.8 1.1-4.6 2.4 3 1.6-4.2 2.2 3.6 1.5-3.4 2 3.8 1.2-2.8c.4 1.2.5 2.4.3 4l1.4.8c.3-1 .4-2.2.4-3.6C31 11.6 27 7 20 7z",
  // Diikat dua
  "M20 8.4c-6.6 0-10.6 4-10.6 10.6 0 1.4.1 2.6.4 3.6l1.5-.6c-.2-1.2-.3-2.2-.3-3.2 0-1.4.2-2.6.6-3.6 2.3 1.5 5.4 2.2 8.4 2.2s6.1-.7 8.4-2.2c.4 1 .6 2.2.6 3.6 0 1-.1 2-.3 3.2l1.5.6c.3-1 .4-2.2.4-3.6C30.6 12.4 26.6 8.4 20 8.4z",
];

/** Cepol di sisi kepala; hanya dipakai wajah keempat. */
const BUNS = 3;

function Face({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 40 40" className="size-7" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#f7f7f7" />
      <path
        d="M20 12c-6.2 0-9.8 3.6-9.8 9.4 0 6.4 4.4 11.6 9.8 11.6s9.8-5.2 9.8-11.6C29.8 15.6 26.2 12 20 12z"
        fill="#fff"
        stroke="#111"
        strokeWidth="1.1"
      />
      <g fill="#111">
        <path d={HAIR[index]} />
        {index === BUNS ? (
          <>
            <circle cx="8.6" cy="20.6" r="3.6" />
            <circle cx="31.4" cy="20.6" r="3.6" />
          </>
        ) : null}
        <ellipse cx="15.6" cy="22.4" rx="1.9" ry="2.5" />
        <ellipse cx="24.4" cy="22.4" rx="1.9" ry="2.5" />
      </g>
      <g fill="#fff">
        <circle cx="16.2" cy="21.5" r=".7" />
        <circle cx="25" cy="21.5" r=".7" />
      </g>
      <path
        d="M18.6 27.6q1.4 1.1 2.8 0"
        fill="none"
        stroke="#111"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VisitorAvatars() {
  return (
    <div className="flex items-center">
      {HAIR.map((_, i) => (
        <div
          key={i}
          // Cincin sewarna footer memisahkan lingkaran yang saling menumpuk.
          className={`rounded-full ring-2 ring-dark-bg ${i > 0 ? "-ml-2.5" : ""}`}
          style={{ zIndex: HAIR.length - i }}
        >
          <Face index={i} />
        </div>
      ))}
    </div>
  );
}
