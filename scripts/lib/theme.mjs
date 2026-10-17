// Design tokens for the "Shinkai night sky" theme. The illustrations are film stills / fanart
// (see scripts/images.json); every card, heading and motion layer reads its colours from here.
export const C = {
  bg0: '#070B1F', // card gradient, deepest
  bg1: '#111A3C',
  line: 'rgba(170,200,255,0.16)', // hairlines and borders
  text: '#F2F6FF',
  soft: '#AAB8DA',
  faint: '#6E7FA8',
  comet: '#8FD3E8',
  sky: '#6FA8DC',
  sunset: '#F4A6B7',
  gold: '#FFD27A',
  violet: '#A99CF0',
  mint: '#7FE0B5',
};

// Section headings sit on GitHub's own background, so they ship a light and a dark variant.
export const HEADING = {
  light: { ink: '#16204A', soft: '#4B5B80', accent: '#3F7FC8' },
  dark: { ink: '#F2F6FF', soft: '#AAB8DA', accent: '#8FD3E8' },
};

// Series colours for charts.
export const SERIES = [C.comet, C.sunset, C.gold, C.violet, C.sky, C.mint, C.faint];

export const FONT = {
  display: 'fuzzy', // Fuzzy Bubbles Bold — bold rounded handwriting for the name, headings and labels (Latin + Vietnamese)
  ui: 'mont', // Montserrat Alternates Regular — interface text (Latin + Vietnamese)
  uiBold: 'montb', // Montserrat Alternates SemiBold — numbers, labels, titles
  jp: 'mincho', // Shippori Mincho B1 Bold — Japanese, the mincho of the film title cards
};
