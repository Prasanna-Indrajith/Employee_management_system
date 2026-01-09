import { Request, Response } from "express";
import { LookupRepository } from "../repositories/lookup.repository";

export class LookupController {
  private repository: LookupRepository;

  constructor() {
    this.repository = new LookupRepository();
  }

  getAllOptions = async (req: Request, res: Response) => {
    try {
      // Run queries in parallel for speed
      const [departments, positions, locations] = await Promise.all([
        this.repository.getDepartments(),
        this.repository.getPositions(),
        this.repository.getLocations(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          departments,
          positions,
          locations,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
