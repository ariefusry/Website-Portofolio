"use client";

import { Mail, Phone } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { externalHref } from "@/lib/utils";
import { Footer, type FooterColumn } from "@/components/ui/footer-section";
import type { Profile } from "@/lib/types";

/**
 * Footer situs: kerangka tampilan dari components/ui/footer-section, diisi
 * data profil dari Supabase. Semua tautan menunjuk tujuan yang benar-benar ada
 * — tidak ada halaman placeholder seperti /pricing atau /blog.
 */
export function Contact({ profile }: { profile: Profile }) {
  const { t } = useLang();

  const columns: FooterColumn[] = [
    {
      label: t(UI.footerNavigate),
      links: [
        { title: t(UI.nav.about), href: "/#about" },
        { title: t(UI.nav.experience), href: "/#experience" },
        { title: t(UI.nav.projects), href: "/projects" },
        { title: t(UI.nav.research), href: "/#research" },
      ],
    },
    {
      label: t(UI.footerContact),
      links: [
        { title: profile.email, href: `mailto:${profile.email}`, icon: Mail },
        {
          title: profile.phone,
          href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
          icon: Phone,
        },
      ],
    },
    {
      label: t(UI.footerElsewhere),
      links: [
        // Tanpa ikon: lucide v1 dan simple-icons sama-sama sudah mencabut
        // lambang LinkedIn/GitHub karena merek dagang, dan menggambar tiruannya
        // bukan pilihan. Labelnya sendiri sudah jelas.
        // externalHref, bukan `https://${...}` mentah: kolomnya minta alamat
        // tanpa skema, tapi kalau ada yang menempel URL lengkap hasilnya jadi
        // `https://https://…`. Helper-nya menerima kedua bentuk.
        { title: "LinkedIn", href: externalHref(profile.linkedin), external: true },
        { title: "GitHub", href: externalHref(profile.github), external: true },
      ],
    },
  ];

  return (
    <Footer
      heading={t(profile.contactHeading)}
      note={t(profile.contactNote)}
      columns={columns}
      copyright={`© ${new Date().getFullYear()} ${profile.name}. ${t(UI.rightsReserved)}`}
    />
  );
}
