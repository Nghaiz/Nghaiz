// Everything personal lives here — edit this file, then `npm run build` to regenerate the art.
export const profile = {
  login: 'Nghaiz',
  name: 'Nguyễn Duy Nghĩa',
  greeting: 'Xin chào',
  greetingJp: 'こんにちは',
  titleJp: '僕の名前は、ギア。', // a nod to 君の名は。: "my name is Nghĩa"
  tagline: 'IT Student @ PTIT  ·  Hà Nội, Việt Nam',

  projects: [
    {
      file: 'project-ironfront',
      kind: 'MULTIPLAYER FPS  ·  NETCODE',
      title: 'Ironfront: Reborn',
      accent: 'comet',
      desc: 'Netcode written from scratch on raw TCP and UDP sockets. One Unity 6 client, four .NET libraries and a wire protocol frozen in week one.',
      tags: ['C#', 'Unity 6', '.NET', 'TCP / UDP'],
      repo: 'Nghaiz/LTM',
    },
    {
      file: 'project-drone',
      kind: 'DRONE  ·  COMPUTER VISION',
      title: 'IOT-CV',
      accent: 'sunset',
      desc: 'An S500 quadcopter on ArduPilot, flown from a web ground station we wrote ourselves, with obstacle avoidance and person detection.',
      tags: ['TypeScript', 'ArduPilot', 'Vision AI'],
      repo: 'ngtukien/IOT-CV',
    },
    {
      file: 'project-realestate',
      kind: 'RAG  ·  GRAPHRAG',
      title: 'Vietnam Real Estates',
      accent: 'gold',
      desc: 'Q&A over Vietnamese property listings that pits LLM-only, RAG, GraphRAG on Neo4j and a hybrid router against the same questions.',
      tags: ['Python', 'Qdrant', 'Neo4j', 'XGBoost'],
      repo: 'ngtukien/Vietnam-Real-Estates',
    },
    {
      file: 'project-intelligent',
      kind: 'MACHINE LEARNING  ·  PTIT',
      title: 'Intelligent Systems',
      accent: 'violet',
      desc: 'Classic ML shipped as real apps (REST API, web and mobile), plus a neural network written by hand in NumPy.',
      tags: ['Python', 'NumPy', 'REST API'],
      repo: 'Nghaiz/Intelligent-System-Development',
    },
  ],

  // skillicons.dev ids, one row each
  stack: [
    'cs,unity,dotnet,cpp,java,go,py,ts,js,dart',
    'nodejs,express,react,mongodb,flutter,docker,githubactions,git,linux,powershell',
  ],
};
