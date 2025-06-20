export function formatDateNorwegian(date: Date): string {
  return date.toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function formatCreatedAtNorwegian(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
} 