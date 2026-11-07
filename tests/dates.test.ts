import { describe, expect, test } from "vitest";
import { dateLabel, sortKey, type EventDate } from "@/lib/dates";

describe("dates", () => {
  test("sorts approximate negative dates first", () => {
    const dates: EventDate[] = [{ year: 900 }, { label: "c. 47,000 BP", sort: -45000, approx: true }];
    const sorted = [...dates].sort((a, b) => sortKey(a) - sortKey(b));
    expect(sorted[0]).toEqual({ label: "c. 47,000 BP", sort: -45000, approx: true });
  });

  test("orders events in the same year by month and day", () => {
    const bohol: EventDate = { year: 2013, month: 10, day: 15 };
    const yolanda: EventDate = { year: 2013, month: 11, day: 8 };
    const yearOnly: EventDate = { year: 2013 };
    expect(sortKey(yearOnly)).toBeLessThan(sortKey(bohol));
    expect(sortKey(bohol)).toBeLessThan(sortKey(yolanda));
    expect(sortKey(yolanda)).toBeLessThan(sortKey({ year: 2014 }));
  });

  test("dateLabel formats exact date", () => {
    expect(dateLabel({ year: 1898, month: 6, day: 12 })).toBe("12 June 1898");
  });

  test("dateLabel returns the label for approx dates and the year for year-only dates", () => {
    expect(dateLabel({ label: "c. 47,000 BP", sort: -45000, approx: true })).toBe("c. 47,000 BP");
    expect(dateLabel({ year: 1521 })).toBe("1521");
    expect(dateLabel({ year: 1896, month: 8 })).toBe("August 1896");
  });
});

describe("range dates and edge days", () => {
  test("a range with a start date sorts by its start", () => {
    const edsa: EventDate = { label: "22–25 February 1986", sort: 0, approx: true, start: { year: 1986, month: 2, day: 22 } };
    const snap: EventDate = { year: 1986, month: 2, day: 7 };
    expect(sortKey(snap)).toBeLessThan(sortKey(edsa));
    const gulf: EventDate = { label: "23–26 October 1944", sort: 0, approx: true, start: { year: 1944, month: 10, day: 23 } };
    expect(sortKey({ year: 1944, month: 10, day: 20 })).toBeLessThan(sortKey(gulf));
  });

  test("31 December sorts before a year-only event of the next year", () => {
    expect(sortKey({ year: 1898, month: 12, day: 31 })).toBeLessThan(sortKey({ year: 1899 }));
  });
});
