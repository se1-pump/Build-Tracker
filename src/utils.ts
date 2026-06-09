import type { Build } from './types';

export const CHECKS = [
  'Application Build Successful',
  'No TypeScript Errors',
  'No ESLint Errors',
  'API Calls Working',
  'Routing Working',
  'Charts Loading',
  'Filters Working',
  'KPI Cards Loading',
  'Print Functionality Tested',
  'Download Functionality Tested',
];

export const CSV_HEADER = [
  'id',
  'date',
  'project',
  'version',
  'commit',
  'features',
  'notes',
  ...CHECKS.map((_, i) => `check_${i}`),
  'savedAt',
];

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === ',' && !inQ) {
      result.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  result.push(cur);
  return result;
}

export function parseCSV(text: string): Build[] {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines
    .slice(1)
    .map((line) => {
      const vals = parseCSVLine(line);
      const obj: Record<string, any> = {};
      headers.forEach((h, i) => (obj[h] = vals[i] ?? ''));
      // Parse boolean check fields
      for (let i = 0; i < 10; i++) {
        const v = obj[`check_${i}`] ?? obj[`c${i}`] ?? '';
        obj[`check_${i}`] = v === true || String(v).toUpperCase() === 'TRUE';
      }
      return obj as Build;
    })
    .sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
}

export function toCSVLine(row: Build): string {
  return CSV_HEADER.map((h) => {
    let v: string;
    if (h.startsWith('check_')) {
      v = (row as any)[h] === true ? 'TRUE' : 'FALSE';
    } else {
      v = String((row as any)[h] ?? '');
    }
    if (v.includes(',') || v.includes('"') || v.includes('\n')) {
      v = `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  }).join(',');
}

export function buildsToCSV(builds: Build[]): string {
  return [CSV_HEADER.join(','), ...builds.map(toCSVLine)].join('\n');
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function toIST(date: Date): string {
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(date.getTime() + offset);
  return istDate.toISOString().replace('Z', '+05:30');
}

export function fmtDate(d: string): string {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${day} ${monthNames[parseInt(m) - 1]} ${y}`;
}

export function esc(s: string | null | undefined): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
