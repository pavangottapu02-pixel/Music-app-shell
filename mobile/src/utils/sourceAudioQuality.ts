// Copyright (C) 2024 - present, MissingCore
// SPDX-License-Identifier: AGPL-3.0-only

export type SourceQualityInput = {
  bitDepth?: number | null;
  sampleRate?: number | null;
  dsdRate?: number | null;
};

export type SourceAudioQualityKind = "pcm" | "dsd" | "unknown";
export type SourceAudioQualityBadge = "hi-res" | "dsd" | null;

export type SourceAudioQuality = {
  kind: SourceAudioQualityKind;
  label: string | null;
  badge: SourceAudioQualityBadge;
  isHiRes: boolean;
  isDsd: boolean;
};

const DSD_RATE_LABELS: Record<number, string> = {
  64: "DSD64 · 2.8 MHz",
  128: "DSD128 · 5.6 MHz",
  256: "DSD256 · 11.2 MHz",
  512: "DSD512 · 22.6 MHz",
};

/**
 * Format sample rate in Hertz to human-readable kHz string (e.g. 44100 -> "44.1 kHz", 96000 -> "96 kHz").
 */
export function formatSampleRateKhz(hz: number): string {
  const khz = hz / 1000;
  const formatted = parseFloat(khz.toFixed(2).replace(/\.?0+$/, ""));
  return `${formatted} kHz`;
}

/**
 * Derive source audio quality (PCM/DSD label and HI-RES/DSD badges) strictly from file/source metadata.
 */
export function getSourceAudioQuality(
  input?: SourceQualityInput | null,
): SourceAudioQuality {
  if (!input) {
    return {
      kind: "unknown",
      label: null,
      badge: null,
      isHiRes: false,
      isDsd: false,
    };
  }

  const { bitDepth, sampleRate, dsdRate } = input;

  // 1. DSD source takes highest precedence
  if (typeof dsdRate === "number" && dsdRate > 0) {
    const label =
      DSD_RATE_LABELS[dsdRate] ||
      `DSD${dsdRate} · ${parseFloat(((dsdRate * 44.1) / 1000).toFixed(1))} MHz`;

    return {
      kind: "dsd",
      label,
      badge: "dsd",
      isHiRes: false,
      isDsd: true,
    };
  }

  const hasBitDepth = typeof bitDepth === "number" && bitDepth > 0;
  const hasSampleRate = typeof sampleRate === "number" && sampleRate > 0;

  // 2. Both bit depth and sample rate available
  if (hasBitDepth && hasSampleRate) {
    const isHiRes = bitDepth >= 24 && sampleRate >= 96000;
    const label = `${bitDepth}-bit · ${formatSampleRateKhz(sampleRate)}`;

    return {
      kind: "pcm",
      label,
      badge: isHiRes ? "hi-res" : null,
      isHiRes,
      isDsd: false,
    };
  }

  // 3. Only sample rate available
  if (hasSampleRate) {
    return {
      kind: "pcm",
      label: formatSampleRateKhz(sampleRate),
      badge: null,
      isHiRes: false,
      isDsd: false,
    };
  }

  // 4. Only bit depth available
  if (hasBitDepth) {
    return {
      kind: "pcm",
      label: `${bitDepth}-bit`,
      badge: null,
      isHiRes: false,
      isDsd: false,
    };
  }

  // 5. Unknown
  return {
    kind: "unknown",
    label: null,
    badge: null,
    isHiRes: false,
    isDsd: false,
  };
}
