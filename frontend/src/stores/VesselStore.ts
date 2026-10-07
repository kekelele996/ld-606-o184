import { Injectable, signal } from "@angular/core";
import type { Vessel } from "../types/Vessel";
import { listVessel } from "../api/Vessel";

@Injectable({ providedIn: "root" })
export class VesselStore {
  rows = signal<Vessel[]>([]);

  async load() {
    this.rows.set(await listVessel());
  }

  nameOf(id: number): string {
    return this.rows().find((row) => row.id === id)?.vessel_name ?? `船舶#${id}`;
  }
}
