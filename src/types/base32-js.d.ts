declare module "base32.js" {
  export function encode(input: string | Uint8Array): string;
  export function decode(input: string): Uint8Array;
}