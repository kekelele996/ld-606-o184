import { Injectable, signal } from "@angular/core";
import type { Berth } from "../types/Berth";
import { listBerth } from "../api/Berth";

@Injectable({ providedIn: "root" })
export class BerthStore {
  rows = signal<Berth[]>([]);

  async load() {
    this.rows.set(await listBerth());
  }

  codeOf(id: number): string {
    return this.rows().find((row) => row.id === id)?.berth_code ?? `#${id}`;
  }
}
