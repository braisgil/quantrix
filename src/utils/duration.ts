import humanizeDuration from "humanize-duration";

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
    largest: 2,
    units: ["h", "m", "s"],
  });

const humanizer = createDurationHumanizer();

export const formatSeconds = (seconds: number | string | null | undefined): string => {
  if (seconds == null) return "0 sec";
  const numeric = typeof seconds === "string" ? parseFloat(seconds.replace(/[^0-9.]/g, "")) : seconds;
  if (!numeric || isNaN(numeric) || numeric <= 0) return "0 sec";
  // Cap absurd values to avoid UI noise
  if (numeric > 999999999) return "0 sec";
  return humanizer(numeric * 1000);
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


