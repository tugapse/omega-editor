// String.prototype.capitalize, used by the inspectors' templates.
declare global {
  interface String {
    capitalize(): string;
  }
}

if (!String.prototype.capitalize) {
  String.prototype.capitalize = function (this: string): string {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
}

export {};
