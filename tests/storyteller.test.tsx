import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { img, makeEvent } from "./helpers";

// next/navigation is not available outside Next: a tiny fake keeps ?topic= in a variable.
let search = "";
const replace = vi.fn((url: string) => {
  search = url.split("?")[1] ?? "";
});
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
  useRouter: () => ({ replace }),
  usePathname: () => "/",
}));

import Storyteller from "@/components/Storyteller";

const manila = { name: "Manila", lat: 14.59, lng: 120.98 };
const events = [
  makeEvent({ id: "mactan", title: "Battle of Mactan", topics: ["war"], place: { name: "Mactan, Cebu", lat: 10.31, lng: 123.98 } }),
  makeEvent({ id: "gomburza", title: "Execution of Gomburza", date: { year: 1872 }, place: manila, images: [img(1, "gomburza")] }),
  makeEvent({ id: "commonwealth", title: "The Commonwealth begins", date: { year: 1935 }, place: manila }),
  makeEvent({ id: "y1946", title: "Independence recognized", date: { year: 1946 }, place: manila }),
];

const currentStep = () => document.querySelector('.step[aria-current="step"]')?.getAttribute("data-index");

beforeEach(() => {
  search = "";
  replace.mockClear();
});
afterEach(() => vi.useRealTimers());

describe("Storyteller", () => {
  test("starts on the first event", () => {
    render(<Storyteller events={events} />);
    expect(currentStep()).toBe("0");
  });

  test("shows empty state when no event matches topic", () => {
    search = "topic=science";
    render(<Storyteller events={events} />);
    expect(screen.getByText("No events for this topic yet.")).toBeInTheDocument();
  });

  test("choosing a topic filters the steps and writes ?topic=", () => {
    render(<Storyteller events={events} />);
    fireEvent.click(screen.getByRole("button", { name: "War" }));
    expect(replace).toHaveBeenCalledWith("/?topic=war", { scroll: false });
  });

  test("Play advances current and stops at end", () => {
    vi.useFakeTimers();
    render(<Storyteller events={events} />);
    fireEvent.click(screen.getByRole("button", { name: /Play/ }));
    act(() => vi.advanceTimersByTime(2200));
    expect(currentStep()).toBe("1");
    act(() => vi.advanceTimersByTime(2200 * 5));
    expect(currentStep()).toBe("3");
    expect(screen.getByRole("button", { name: /Play/ })).toHaveAttribute("aria-pressed", "false");
  });

  test("seeking stops play", () => {
    vi.useFakeTimers();
    render(<Storyteller events={events} />);
    fireEvent.click(screen.getByRole("button", { name: /Play/ }));
    fireEvent.change(screen.getByRole("slider", { name: "Move through events" }), { target: { value: "2" } });
    expect(currentStep()).toBe("2");
    expect(screen.getByRole("button", { name: /Play/ })).toHaveAttribute("aria-pressed", "false");
    act(() => vi.advanceTimersByTime(2200 * 3));
    expect(currentStep()).toBe("2");
  });

  test("place panel lists all events at a stacked spot", () => {
    render(<Storyteller events={events} />);
    fireEvent.click(screen.getByRole("button", { name: "Execution of Gomburza, Manila" }));
    const card = screen.getByRole("dialog", { name: "Execution of Gomburza" });
    // the card shows the photo, the title and one Read link
    expect(within(card).getByRole("img")).toHaveAttribute("src", "/images/events/gomburza-1.webp");
    expect(within(card).getByRole("link", { name: /Read the story/ })).toHaveAttribute("href", "/events/gomburza");
    // and the other events at the same place
    expect(within(card).getByRole("button", { name: /The Commonwealth begins/ })).toBeInTheDocument();
    expect(within(card).getByRole("button", { name: /Independence recognized/ })).toBeInTheDocument();
    fireEvent.click(within(card).getByRole("button", { name: /The Commonwealth begins/ }));
    expect(screen.getByRole("dialog", { name: "The Commonwealth begins" })).toBeInTheDocument();
  });

  test("the card closes with its close button and with Escape", () => {
    render(<Storyteller events={events} />);
    fireEvent.click(screen.getByRole("button", { name: "Battle of Mactan, Mactan, Cebu" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Battle of Mactan, Mactan, Cebu" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("zoom buttons change the zoom level", () => {
    render(<Storyteller events={events} />);
    expect(screen.getByText("1.0×")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("1.6×")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show whole map" }));
    expect(screen.getByText("1.0×")).toBeInTheDocument();
  });
});

describe("static first paint", () => {
  test("StorytellerFallback renders every story without reading the URL", async () => {
    const { StorytellerFallback } = await import("@/components/Storyteller");
    render(<StorytellerFallback events={events} />);
    expect(screen.getByRole("heading", { name: "Battle of Mactan" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Read the story/ })).toHaveLength(4);
  });
});
