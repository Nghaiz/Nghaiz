// Everything personal lives here — edit this file, then `npm run build` to regenerate the art.
export const profile = {
  login: 'Nghaiz',
  name: 'Nguyễn Duy Nghĩa',
  greeting: 'Xin chào!',
  greetingJp: 'こんにちは',
  titleJp: '僕の名前は、ギア。', // a nod to 君の名は。 — "my name is Nghĩa"
  tagline: 'IT Student @ PTIT  ·  Hà Nội, Việt Nam',
  sealKanji: '義', // "Nghĩa" in Sino-Vietnamese
  motto: '継続は力なり', // "Persistence is power"

  toolbox: [
    { label: 'Languages', items: ['C#', 'Python', 'TypeScript', 'Java', 'C++', 'Go', 'JavaScript', 'Dart'] },
    { label: 'Game & Systems', items: ['Unity 6', '.NET', 'TCP / UDP sockets', 'Assembly 8086', 'ShaderLab'] },
    { label: 'AI & Data', items: ['NumPy', 'Jupyter', 'RAG / GraphRAG', 'Neo4j', 'Qdrant', 'XGBoost'] },
    { label: 'Web & App', items: ['Node.js', 'Express', 'React', 'MongoDB', 'Flutter', 'REST APIs'] },
    { label: 'Tools', items: ['Git', 'GitHub Actions', 'Docker', 'PowerShell', 'Linux', 'LaTeX'] },
  ],

  projects: [
    {
      file: 'project-ironfront',
      title: 'Ironfront: Reborn',
      jp: '鉄の前線',
      icon: 'target',
      tint: 'sunset',
      desc: 'A multiplayer FPS whose netcode is written from scratch on raw TCP and UDP sockets. One Unity 6 client, four .NET libraries, one frozen wire protocol.',
      tags: ['C#', 'Unity 6', '.NET', 'Netcode'],
      repo: 'Nghaiz/LTM',
    },
    {
      file: 'project-drone',
      title: 'IOT-CV Drone',
      jp: '空の目',
      icon: 'drone',
      tint: 'sky',
      desc: 'An S500 quadcopter on ArduPilot, flown from a hand-written web ground station, with obstacle avoidance and on-board person detection.',
      tags: ['TypeScript', 'ArduPilot', 'Computer Vision'],
      repo: 'ngtukien/IOT-CV',
    },
    {
      file: 'project-realestate',
      title: 'Vietnam Real Estates',
      jp: '不動産',
      icon: 'house',
      tint: 'sun',
      desc: 'A Q&A assistant over Vietnamese property listings that compares LLM-only, RAG, GraphRAG on Neo4j and a hybrid router on the same questions.',
      tags: ['Python', 'Qdrant', 'Neo4j', 'XGBoost'],
      repo: 'ngtukien/Vietnam-Real-Estates',
    },
    {
      file: 'project-intelligent',
      title: 'Intelligent Systems',
      jp: '知能',
      icon: 'sprout',
      tint: 'dusk',
      desc: 'PTIT coursework: classic machine learning, systems you can deploy (REST API, web and mobile) and a neural network written by hand in NumPy.',
      tags: ['Python', 'NumPy', 'REST API', 'Mobile'],
      repo: 'Nghaiz/Intelligent-System-Development',
    },
  ],
};
