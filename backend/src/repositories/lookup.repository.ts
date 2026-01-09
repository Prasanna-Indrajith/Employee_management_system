import { query } from "../config/db";

export class LookupRepository {
  async getDepartments() {
    const result = await query(
      "SELECT id, name FROM departments ORDER BY name ASC"
    );
    return result.rows;
  }

  async getPositions() {
    // We select department_id too, so we can filter positions based on selected department later!
    const result = await query(
      "SELECT id, title, department_id FROM positions ORDER BY title ASC"
    );
    return result.rows;
  }

  async getLocations() {
    const result = await query(
      "SELECT id, name FROM locations ORDER BY name ASC"
    );
    return result.rows;
  }
}
