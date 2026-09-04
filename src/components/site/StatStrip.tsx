"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import type { Stat } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Angka yang menghitung naik dari 0; nilai non-numerik ditampilkan apa adanya. */
function StatValue({ stat, reduced }: { stat: Stat; reduced: boolean }) {
  const target = Number(stat.value);
  const animatable = stat.isNumeric && Number.isFinite(target) && !reduced;

  // `null` berarti "belum/tidak dianimasikan" — nilai akhir diturunkan saat
  // render, jadi tidak perlu setState di dalam effect untuk kasus statis.
  const [tick, setTick] = useState<string | null>(
    animatable ? (0).toFixed(stat.decimals) : null,
  );

  useEffect(() => {
    if (!animatable) return;
    const controls = animate(0, target, {
      duration: 1.1,
      delay: 0.95,
      ease: "easeOut",
      onUpdate: (v) => setTick(v.toFixed(stat.decimals)),
    });
    return () => controls.stop();
  }, [animatable, target, stat.decimals]);

  return <>{tick ?? stat.value}</>;
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="grid grid-cols-2 border-y border-[var(--color-line)] bg-surface lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.id}
          className="stat-cell px-[30px] py-[26px]"
          {...(reduced
            ? { initial: false as const, animate: { opacity: 1, y: 0 } }
            : {
                initial: { opacity: 0, y: 18 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.85 + i * 0.08, ease: EASE },
              })}
        >
          <div className="font-display text-[28px] leading-none font-semibold">
            <StatValue stat={stat} reduced={reduced} />
          </div>
          <div className="mt-2 font-body text-xs leading-[1.4] font-medium text-muted">
            {t(stat.label)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
