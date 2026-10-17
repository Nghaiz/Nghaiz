// Everything personal lives here — edit this file, then `npm run build` to regenerate the art.
// The tech stack lives in scripts/stack.config.mjs.
export const profile = {
  login: 'Nghaiz',
  name: 'Nguyễn Duy Nghĩa',
  greeting: 'Xin chào',
  greetingJp: 'こんにちは',
  titleJp: '僕の名前は、ギア。', // a nod to 君の名は。: "my name is Nghĩa"
  tagline: 'IT Student @ PTIT  ·  Hà Nội, Việt Nam',
  role: 'Software engineer, heading for DevOps & Cloud',

  // University projects. `tags` use the names in stack.config.mjs LOGOS so they get a logo.
  projects: [
    {
      file: 'project-ironfront',
      title: 'Ironfront: Reborn',
      kind: 'multiplayer FPS  ·  netcode',
      doodle: 'target', tint: 'rose', tape: 'blue',
      desc: 'A multiplayer FPS whose netcode is written from scratch on raw TCP and UDP. A Unity 6 client, four .NET libraries and Docker images, behind a CI gate that guards every merge.',
      tags: ['C#', 'Unity 6', '.NET', 'Docker'],
      repo: 'Nghaiz/LTM',
    },
    {
      file: 'project-drone',
      title: 'Drone Vision',
      kind: 'IoT  ·  computer vision',
      doodle: 'drone', tint: 'blue', tape: 'rose',
      desc: 'An S500 quadcopter on ArduPilot, flown from a web ground station we wrote ourselves, with obstacle avoidance and person detection running on board.',
      tags: ['TypeScript', 'React', 'FastAPI', 'OpenCV'],
      repo: 'ngtukien/IOT-CV',
    },
    {
      file: 'project-realestate',
      title: 'Vietnam Real Estates',
      kind: 'RAG  ·  GraphRAG',
      doodle: 'houseSearch', tint: 'peach', tape: 'sage',
      desc: 'Q&A over Vietnamese property listings that puts LLM-only, RAG, GraphRAG on Neo4j and a hybrid router through the same questions.',
      tags: ['Python', 'FastAPI', 'Neo4j', 'React'],
      repo: 'ngtukien/Vietnam-Real-Estates',
    },
    {
      file: 'project-intelligent',
      title: 'Intelligent Systems',
      kind: 'machine learning  ·  PTIT',
      doodle: 'bulb', tint: 'butter', tape: 'lilac',
      desc: 'Classic ML shipped as real apps (a Flask API, the web and a Flutter app), plus a neural network written by hand in NumPy.',
      tags: ['Python', 'scikit-learn', 'Flask', 'Flutter'],
      repo: 'Nghaiz/Intelligent-System-Development',
    },
  ],
};
