// Event dates can be exact (12 June 1898), partial (August 1896, 1521)
// or approximate with a display label (c. 47,000 BP) and a number to sort by.

export type ExactDate = { year: number; month?: number; day?: number };
/** A range or uncertain date. If it has a start date, that decides its place in time; otherwise `sort` does. */
export type ApproxDate = { label: string; sort: number; approx: true; start?: ExactDate };
export type EventDate = ExactDate | ApproxDate;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const isApprox = (d: EventDate): d is ApproxDate => "approx" in d && d.approx === true;

/** A number that orders events in time. Year-only dates sort before dated days of that year. */
export function sortKey(d: EventDate): number {
  if (isApprox(d)) return d.start ? exactKey(d.start) : d.sort;
  return exactKey(d);
}

/** year + (month*32 + day)/416: always below year+1, even for 31 December. */
const exactKey = (d: ExactDate) => d.year + ((d.month ?? 0) * 32 + (d.day ?? 0)) / 416;

/** Human-readable date, e.g. "12 June 1898", "August 1896", "1521", "c. 47,000 BP". */
export function dateLabel(d: EventDate): string {
  if (isApprox(d)) return d.label;
  if (d.month && d.day) return `${d.day} ${MONTHS[d.month - 1]} ${d.year}`;
  if (d.month) return `${MONTHS[d.month - 1]} ${d.year}`;
  return String(d.year);
}
