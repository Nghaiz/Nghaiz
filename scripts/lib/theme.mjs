// Design tokens for the "Shinkai sky" theme — cloud-white cards, blue sky, sunset and comet accents.
// The illustrations themselves are film stills / fanart (see scripts/images.json); everything drawn
// on top of them, and every UI card, reads its colours and fonts from here.
export const C = {
  paper: '#F6F9FE', // cloud-white card
  paperDeep: '#E9F0FA',
  rule: '#D6E1F0',
  ink: '#1E2A4A', // night-blue text
  inkSoft: '#4B5B80',
  inkFaint: '#8A98B8',
  sky: '#6FA8DC',
  skyDeep: '#3F6FB5',
  dusk: '#7C6BB0', // twilight violet
  sunset: '#F08A7E',
  sun: '#F6C86B',
  comet: '#8FD3E8',
  blush: '#F4B6C8',
  white: '#FFFFFF',
};

// Text for transparent assets rendered inside <picture> dark sources.
export const DARK = {
  ink: '#EEF3FF',
  inkSoft: '#B8C6E6',
  accent: '#8FD3E8',
};

// Series colours for charts and chips.
export const SERIES = [C.sky, C.sunset, C.sun, C.dusk, C.blush, C.comet, C.inkFaint];

export const FONT = {
  serif: 'gentium', // Gentium Book Plus Bold — film-title serif (Latin + Vietnamese)
  hand: 'patrick', // Patrick Hand — handwritten notes (Latin + Vietnamese)
  jp: 'klee', // Klee One — Japanese handwriting (Japanese only)
  brush: 'yuji', // Yuji Syuku — brush calligraphy (Japanese only)
};
