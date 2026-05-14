function formatPtBr(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function birthDateUnder16(today: Date = new Date()): string {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - 16);
  d.setDate(d.getDate() + 1);
  return formatPtBr(d);
}

export function birthDateExactly16(today: Date = new Date()): string {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - 16);
  return formatPtBr(d);
}

export function birthDateOver16(today: Date = new Date()): string {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - 16);
  d.setDate(d.getDate() - 1);
  return formatPtBr(d);
}

export function birthDateFuture(today: Date = new Date()): string {
  const d = new Date(today);
  d.setDate(d.getDate() + 1);
  return formatPtBr(d);
}
