import humanizeDuration, { type Unit } from "humanize-duration";

// Constants for duration formatting
const MAX_REASONABLE_DURATION_SECONDS = 999_999_999; // ~31.7 years - cap absurd values
const DURATION_UNITS: Unit[] = ["h", "m", "s"];
const LARGEST_UNITS_TO_SHOW = 2;

// Factory to centralize humanizer config
const createDurationHumanizer = () =>
  humanizeDuration.humanizer({
    language: "enShortWords",
    languages: {
      enShortWords: {
        h: () => "hr",
        m: () => "min",
        s: () => "sec",
      },
    },
    delimiter: " ",
    spacer: " ",
    round: true,
    largest: LARGEST_UNITS_TO_SHOW,
    units: DURATION_UNITS,
  });

const humanizer = createDurationHumanizer();

export const formatSeconds = (seconds: number | string | null | undefined): string => {
  if (seconds == null) return "0 sec";
  const numeric = typeof seconds === "string" ? parseFloat(seconds.replace(/[^0-9.]/g, "")) : seconds;
  if (!numeric || isNaN(numeric) || numeric <= 0) return "0 sec";
  // Clamp absurd values to a max and indicate bound instead of returning 0
  const clamped = Math.min(numeric, MAX_REASONABLE_DURATION_SECONDS);
  const formatted = humanizer(clamped * 1000);
  return numeric > MAX_REASONABLE_DURATION_SECONDS ? `≥ ${formatted}` : formatted;
};

export const formatDurationBetween = (start: string | null, end: string | null): string => {
  if (!start) return "Not started";
  if (!end) return "In progress";
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const delta = Math.max(0, endMs - startMs);
  if (delta === 0) return "0 sec";
  return humanizer(delta);
};


