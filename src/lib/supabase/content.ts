import { SEED } from "../seed";
import type {
  Bi,
  BiList,
  Content,
  Experience,
  Lang,
  Profile,
  Project,
  ProjectFact,
  Research,
  SkillGroup,
  SiteSettings,
  Stat,
  Track,
} from "../types";
import { createPublicClient } from "./server";
import { BUCKET_ASSETS, BUCKET_DOCS, supabaseConfigured } from "./env";

/* Bentuk baris apa adanya dari Postgres — sengaja longgar, divalidasi saat dipetakan. */
type Row = Record<string, unknown>;

const str = (row: Row, key: string, fallback = ""): string => {
  const v = row[key];
  return typeof v === "string" ? v : fallback;
};

const bool = (row: Row, key: string, fallback = false): boolean => {
  const v = row[key];
  return typeof v === "boolean" ? v : fallback;
};

const num = (row: Row, key: string, fallback = 0): number => {
  const v = row[key];
  return typeof v === "number" ? v : fallback;
};

const arr = (row: Row, key: string): string[] => {
  const v = row[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
};

/** Versi daftar dari `bi`: kolom `<base>_en` / `<base>_id` bertipe text[]. */
const biList = (row: Row, base: string): BiList => {
  const en = arr(row, `${base}_en`);
  const id = arr(row, `${base}_id`);
  return { en, id: id.length ? id : en };
};

/** Kolom `<base>_en` / `<base>_id` → objek bilingual, dengan ID jatuh ke EN bila kosong. */
const bi = (row: Row, base: string, fallback: Bi = { en: "", id: "" }): Bi => {
  const en = str(row, `${base}_en`, fallback.en);
  const id = str(row, `${base}_id`, "");
  return { en, id: id || en || fallback.id };
};

function publicUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return createPublicClient().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function mapProfile(row: Row | null): Profile {
  if (!row) return SEED.profile;
  return {
    name: str(row, "name", SEED.profile.name),
    badge: bi(row, "badge", SEED.profile.badge),
    heroTitle: bi(row, "hero_title", SEED.profile.heroTitle),
    heroSub: bi(row, "hero_sub", SEED.profile.heroSub),
    about: bi(row, "about", SEED.profile.about),
    contactHeading: bi(row, "contact_heading", SEED.profile.contactHeading),
    contactNote: bi(row, "contact_note", SEED.profile.contactNote),
    photoUrl: publicUrl(BUCKET_ASSETS, str(row, "photo_path") || null),
    cvUrl: publicUrl(BUCKET_DOCS, str(row, "cv_path") || null),
    email: str(row, "email", SEED.profile.email),
    phone: str(row, "phone", SEED.profile.phone),
    linkedin: str(row, "linkedin", SEED.profile.linkedin),
    github: str(row, "github", SEED.profile.github),
  };
}

const mapStats = (rows: Row[]): Stat[] =>
  rows.map((row) => ({
    id: str(row, "id"),
    value: str(row, "value"),
    isNumeric: bool(row, "is_numeric"),
    decimals: num(row, "decimals"),
    label: bi(row, "label"),
  }));

const mapTracks = (rows: Row[]): Track[] =>
  rows.map((row) => ({
    id: str(row, "id"),
    title: bi(row, "title"),
    body: bi(row, "body"),
    chips: arr(row, "chips"),
    accent: bool(row, "accent"),
  }));

const mapProjects = (rows: Row[]): Project[] =>
  rows.map((row) => ({
    id: str(row, "id"),
    slug: str(row, "slug"),
    title: str(row, "title"),
    summary: bi(row, "summary"),
    badges: arr(row, "badges"),
    accentBadge: bool(row, "accent_badge"),
    tech: arr(row, "tech"),
    imageUrl: publicUrl(BUCKET_ASSETS, str(row, "image_path") || null),
    githubUrl: str(row, "github_url") || null,
    liveUrl: str(row, "live_url") || null,
    featured: bool(row, "featured"),
    hasThumb: bool(row, "has_thumb", true),
    role: bi(row, "role"),
    status: bi(row, "status"),
    overview: bi(row, "overview"),
    facts: Array.isArray(row.facts)
      ? (row.facts as Row[]).map(
          (f): ProjectFact => ({ label: str(f, "label"), value: bi(f, "value") }),
        )
      : [],
    imageUrls: arr(row, "image_paths")
      .map((path) => publicUrl(BUCKET_ASSETS, path))
      .filter((url): url is string => Boolean(url)),
    highlights: biList(row, "highlights"),
  }));

function mapResearch(row: Row | null): Research {
  if (!row) return SEED.research;
  const metrics = Array.isArray(row.metrics)
    ? (row.metrics as Row[]).map((m) => ({
        label: str(m, "label"),
        value: str(m, "value"),
      }))
    : SEED.research.metrics;

  return {
    badge: str(row, "badge", SEED.research.badge),
    title: str(row, "title", SEED.research.title),
    body: bi(row, "body", SEED.research.body),
    metrics,
  };
}

const mapExperiences = (rows: Row[]): Experience[] =>
  rows.map((row) => ({
    id: str(row, "id"),
    period: bi(row, "period"),
    role: bi(row, "role"),
    body: bi(row, "body"),
  }));

const mapSkillGroups = (rows: Row[]): SkillGroup[] =>
  rows.map((row) => ({
    id: str(row, "id"),
    name: bi(row, "name"),
    items: arr(row, "items"),
    accent: bool(row, "accent"),
  }));

function mapSettings(row: Row | null): SiteSettings {
  if (!row) return SEED.settings;
  const lang = str(row, "default_lang", SEED.settings.defaultLang);
  return { defaultLang: (lang === "ID" ? "ID" : "EN") as Lang };
}

/**
 * Ambil seluruh konten dari Supabase.
 * Mengembalikan null bila env belum diisi; tiap tabel yang gagal/kosong
 * jatuh ke bagian SEED yang setara supaya halaman tidak pernah kosong.
 */
export async function fetchContentFromSupabase(): Promise<Content | null> {
  if (!supabaseConfigured) return null;

  const db = createPublicClient();
  const rows = <T = Row>(res: { data: unknown; error: unknown }): T[] =>
    res.error || !Array.isArray(res.data) ? [] : (res.data as T[]);
  const one = (res: { data: unknown; error: unknown }): Row | null =>
    res.error || !res.data ? null : (res.data as Row);

  const [
    profileRes,
    statsRes,
    tracksRes,
    projectsRes,
    researchRes,
    experiencesRes,
    skillsRes,
    settingsRes,
  ] = await Promise.all([
    db.from("profile").select("*").eq("id", 1).maybeSingle(),
    db.from("stats").select("*").order("sort"),
    db.from("tracks").select("*").order("sort"),
    db.from("projects").select("*").order("sort"),
    db.from("research").select("*").eq("id", 1).maybeSingle(),
    db.from("experiences").select("*").order("sort"),
    db.from("skill_groups").select("*").order("sort"),
    db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const projects = mapProjects(rows(projectsRes));
  const resolvedProjects = projects.length ? projects : SEED.projects;

  const stats = mapStats(rows(statsRes));
  const tracks = mapTracks(rows(tracksRes));
  const experiences = mapExperiences(rows(experiencesRes));
  const skillGroups = mapSkillGroups(rows(skillsRes));

  return {
    profile: mapProfile(one(profileRes)),
    stats: stats.length ? stats : SEED.stats,
    tracks: tracks.length ? tracks : SEED.tracks,
    projects: resolvedProjects,
    research: mapResearch(one(researchRes)),
    experiences: experiences.length ? experiences : SEED.experiences,
    skillGroups: skillGroups.length ? skillGroups : SEED.skillGroups,
    settings: mapSettings(one(settingsRes)),
  };
}
