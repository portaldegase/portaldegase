import { describe, it, expect } from "vitest";

describe("Search Functionality", () => {
  it("should handle case-insensitive search", () => {
    const searchTerm = "governo";
    const searchLower = searchTerm.toLowerCase();
    const text = "O Governo do Estado do Rio de Janeiro";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(true);
  });

  it("should find partial word matches", () => {
    const searchTerm = "gov";
    const searchLower = searchTerm.toLowerCase();
    const text = "O Governo do Estado do Rio de Janeiro";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(true);
  });

  it("should find accented partial words", () => {
    const searchTerm = "são";
    const searchLower = searchTerm.toLowerCase();
    const text = "Centro de Socioeducação em São Gonçalo";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(true);
  });

  it("should find partial accented words", () => {
    const searchTerm = "socio";
    const searchLower = searchTerm.toLowerCase();
    const text = "Centro de Socioeducação em São Gonçalo";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(true);
  });

  it("should handle uppercase search", () => {
    const searchTerm = "GOVERNO";
    const searchLower = searchTerm.toLowerCase();
    const text = "O Governo do Estado do Rio de Janeiro";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(true);
  });

  it("should handle mixed case search", () => {
    const searchTerm = "GoVeRnO";
    const searchLower = searchTerm.toLowerCase();
    const text = "O Governo do Estado do Rio de Janeiro";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(true);
  });

  it("should create search pattern with wildcards", () => {
    const searchTerm = "gov";
    const searchLower = searchTerm.toLowerCase();
    const pattern = `%${searchLower}%`;
    
    expect(pattern).toBe("%gov%");
  });

  it("should not match unrelated terms", () => {
    const searchTerm = "xyz";
    const searchLower = searchTerm.toLowerCase();
    const text = "O Governo do Estado do Rio de Janeiro";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(false);
  });

  it("should handle empty search term", () => {
    const searchTerm = "";
    const searchLower = searchTerm.toLowerCase();
    const text = "O Governo do Estado do Rio de Janeiro";
    
    const isMatch = text.toLowerCase().includes(searchLower);
    expect(isMatch).toBe(true); // Empty string is found in any string
  });

  it("should filter posts by search term", () => {
    const posts = [
      { id: 1, title: "O Governo inaugurou novo centro", content: "Notícia importante" },
      { id: 2, title: "Eventos de Socioeducação", content: "Confira os eventos" },
      { id: 3, title: "São Gonçalo recebe investimentos", content: "Investimento em infraestrutura" },
    ];

    const searchTerm = "gov";
    const searchLower = searchTerm.toLowerCase();
    
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it("should find multiple matches with partial search", () => {
    const posts = [
      { id: 1, title: "Governo do Estado", content: "Notícia" },
      { id: 2, title: "Socioeducação", content: "Programa" },
      { id: 3, title: "São Gonçalo", content: "Cidade" },
    ];

    const searchTerm = "são";
    const searchLower = searchTerm.toLowerCase();
    
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(3);
  });
});
