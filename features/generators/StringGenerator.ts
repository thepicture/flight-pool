export class StringGenerator {
  static generate(length: number): string {
    const chars = new Array(122 - 97 + 1)
      .fill(null)
      .map((_, index) => String.fromCharCode(97 + index));

    const result = new Array(length)
      .fill(null)
      .map(() => chars[Math.floor(Math.random() * chars.length)]);

    return result.join("");
  }
}
