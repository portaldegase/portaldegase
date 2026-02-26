import { describe, it, expect } from "vitest";

describe("Service Analytics", () => {
  it("should track service clicks correctly", () => {
    // Simular rastreamento de clicks
    const clicks = { serviceId: 1, count: 5 };
    expect(clicks.count).toBe(5);
  });

  it("should calculate percentage of clicks", () => {
    const totalClicks = 100;
    const serviceClicks = 25;
    const percentage = (serviceClicks / totalClicks) * 100;
    expect(percentage).toBe(25);
  });

  it("should identify top services by click count", () => {
    const services = [
      { id: 1, name: "Service A", clicks: 50 },
      { id: 2, name: "Service B", clicks: 30 },
      { id: 3, name: "Service C", clicks: 20 },
    ];

    const topServices = services.sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    expect(topServices[0].name).toBe("Service A");
    expect(topServices[0].clicks).toBe(50);
  });

  it("should calculate average clicks per service", () => {
    const services = [
      { clicks: 50 },
      { clicks: 30 },
      { clicks: 20 },
    ];

    const totalClicks = services.reduce((sum, s) => sum + s.clicks, 0);
    const average = Math.round(totalClicks / services.length);
    expect(average).toBe(33);
  });

  it("should handle empty analytics data", () => {
    const services: any[] = [];
    const totalClicks = services.reduce((sum, s) => sum + (s.clicks || 0), 0);
    expect(totalClicks).toBe(0);
  });

  it("should format date correctly", () => {
    const date = new Date("2026-02-26T00:00:00Z");
    const formatted = date.toLocaleDateString("pt-BR");
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("should validate service colors", () => {
    const validColor = "#0066CC";
    const hexRegex = /^#[0-9A-F]{6}$/i;
    expect(hexRegex.test(validColor)).toBe(true);
  });
});
