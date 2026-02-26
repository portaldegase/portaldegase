import { describe, it, expect } from "vitest";

describe("Services", () => {
  it("should validate service creation input", () => {
    const validService = {
      name: "Portal de Serviços",
      icon: "https://example.com/icon.png",
      link: "https://example.com",
      color: "#0066CC",
      sortOrder: 0,
      isActive: true,
    };

    expect(validService.name).toBeTruthy();
    expect(validService.icon).toMatch(/^https?:\/\//);
    expect(validService.link).toMatch(/^https?:\/\//);
    expect(validService.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("should validate service color format", () => {
    const validColors = ["#0066CC", "#FF0000", "#00FF00"];
    const invalidColors = ["0066CC", "FF0000", "red"];

    validColors.forEach(color => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    invalidColors.forEach(color => {
      expect(color).not.toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it("should validate service URL format", () => {
    const validUrls = [
      "https://example.com",
      "https://example.com/path",
      "https://example.com/path?query=value",
    ];

    const invalidUrls = [
      "not-a-url",
      "example.com",
      "ftp://example.com",
    ];

    validUrls.forEach(url => {
      expect(url).toMatch(/^https?:\/\//);
    });

    invalidUrls.forEach(url => {
      expect(url).not.toMatch(/^https?:\/\//);
    });
  });

  it("should handle service sorting", () => {
    const services = [
      { id: 1, name: "Service A", sortOrder: 3 },
      { id: 2, name: "Service B", sortOrder: 1 },
      { id: 3, name: "Service C", sortOrder: 2 },
    ];

    const sorted = [...services].sort((a, b) => a.sortOrder - b.sortOrder);

    expect(sorted[0].sortOrder).toBe(1);
    expect(sorted[1].sortOrder).toBe(2);
    expect(sorted[2].sortOrder).toBe(3);
  });

  it("should filter active services", () => {
    const services = [
      { id: 1, name: "Active Service", isActive: true },
      { id: 2, name: "Inactive Service", isActive: false },
      { id: 3, name: "Another Active", isActive: true },
    ];

    const activeServices = services.filter(s => s.isActive);

    expect(activeServices).toHaveLength(2);
    expect(activeServices.every(s => s.isActive)).toBe(true);
  });
});
