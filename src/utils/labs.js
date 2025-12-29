export function sortRecordsAsc(records) {
  return [...(records ?? [])].sort((a, b) => a.lab_date.localeCompare(b.lab_date));
}

export function getLatestRecord(records) {
  const sorted = sortRecordsAsc(records);
  return sorted.at(-1) ?? null;
}

export function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function getAllDates(labs) {
  const set = new Set();
  (labs ?? []).forEach(l => (l.records ?? []).forEach(r => set.add(r.lab_date)));
  return [...set].sort(); // "YYYY-MM-DD" 字串排序 OK
}

export function buildRecordMap(labs) {
  // lab_code -> Map(date -> record)
  const map = new Map();
  (labs ?? []).forEach(lab => {
    const m = new Map();
    (lab.records ?? []).forEach(r => m.set(r.lab_date, r));
    map.set(lab.lab_code, m);
  });
  return map;
}

export function toSeries(lab) {
  const sorted = sortRecordsAsc(lab?.records ?? []);
  return sorted
    .map(r => ({ date: r.lab_date, value: toNumber(r.lab_value), abnormal: r.abnormal ?? null }))
    .filter(p => p.value !== null);
}
