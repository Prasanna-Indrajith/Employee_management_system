UPDATE employees
SET salary =
  CASE
    -- Engineering employees (IDs 1, 2, 4)
    WHEN employees.position_id IN (1, 2, 4) THEN
      CASE
        WHEN positions.title LIKE '%Senior%' THEN 120000
        WHEN positions.title LIKE '%Team Lead%' THEN 110000
        WHEN positions.title LIKE '%Developer%' THEN 95000
        WHEN positions.title LIKE '%Junior%' THEN 75000
        WHEN positions.title LIKE '%Project Manager%' THEN 105000
        ELSE 85000
      END

    -- Marketing employees (IDs 7, 8, 9)
    WHEN employees.position_id IN (7, 8, 9) THEN
      CASE
        WHEN positions.title LIKE '%Executive%' THEN 95000
        WHEN positions.title LIKE '%SEO%' THEN 70000
        WHEN positions.title LIKE '%Content%' THEN 65000
        ELSE 60000
      END

    -- Sales employees (IDs 10, 11)
    WHEN employees.position_id IN (10, 11) THEN
      CASE
        WHEN positions.title LIKE '%Manager%' THEN 100000
        WHEN positions.title LIKE '%Representative%' THEN 55000
        ELSE 50000
      END

    -- HR employees (IDs 12, 13)
    WHEN employees.position_id IN (12, 13) THEN
      CASE
        WHEN positions.title LIKE '%Manager%' THEN 90000
        WHEN positions.title LIKE '%Recruiter%' THEN 70000
        ELSE 65000
      END

    -- Finance employees (IDs 14, 15, 16)
    WHEN employees.position_id IN (14, 15, 16) THEN
      CASE
        WHEN positions.title LIKE '%Accountant%' THEN 85000
        WHEN positions.title LIKE '%Officer%' THEN 90000
        WHEN positions.title LIKE '%Analyst%' THEN 75000
        ELSE 70000
      END

    -- SAFETY: Keep existing salary if no logic matches
    ELSE employees.salary
  END
FROM positions -- Required in Postgres to check the title
WHERE employees.position_id = positions.id
  AND employees.salary IS NOT NULL;