import { AssetManager } from "@/components/admin/AssetManager";
import { PhotoCropper } from "@/components/admin/PhotoCropper";

export default function AssetsPage() {
  return (
    <>
      <h1 className="mt-0 mb-2 font-display text-2xl font-semibold tracking-[-0.02em]">
        Aset & CV
      </h1>
      <p className="mt-0 mb-8 max-w-xl font-body text-sm text-muted">
        Unggah foto profil (rasio ±4:5), screenshot proyek, dan CV PDF. Setelah
        diunggah, salin nama berkasnya ke kolom path di halaman Profil atau
        Selected work.
      </p>
      <PhotoCropper />
      <AssetManager />
    </>
  );
}
