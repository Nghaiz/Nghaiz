// Tech stack and logo map. Every toolbox entry is backed by at least one repo (manifests, workflows
// or project files); `next: true` marks what I'm learning next rather than already using.
// Logos are devicon slugs, vendored into assets/logos/ by `npm run logos`.

/** Display name → devicon slug. Shared by the toolbox, language and project cards. */
export const LOGOS = {
  'C#': 'csharp', Python: 'python', TypeScript: 'typescript', JavaScript: 'javascript', Java: 'java', Go: 'go', Dart: 'dart',
  'C++': 'cplusplus', C: 'c', Bash: 'bash', Shell: 'bash', PowerShell: 'powershell', HTML: 'html5', CSS: 'css3',
  'Jupyter Notebook': 'jupyter', TeX: 'latex', LaTeX: 'latex', Kotlin: 'kotlin', PHP: 'php', Dockerfile: 'docker', CMake: 'cmake',
  ShaderLab: 'unity', Cypher: 'neo4j', SCSS: 'sass',
  React: 'react', 'Next.js': 'nextjs', Vite: 'vitejs', 'Tailwind CSS': 'tailwindcss', 'Three.js': 'threejs', Flutter: 'flutter', Unity: 'unity', 'Unity 6': 'unity',
  'Node.js': 'nodejs', Express: 'express', FastAPI: 'fastapi', Flask: 'flask', 'Spring Boot': 'spring', '.NET': 'dot-net', 'Socket.IO': 'socketio',
  PyTorch: 'pytorch', TensorFlow: 'tensorflow', 'scikit-learn': 'scikitlearn', OpenCV: 'opencv', NumPy: 'numpy', Pandas: 'pandas', Jupyter: 'jupyter', Streamlit: 'streamlit',
  Docker: 'docker', Kubernetes: 'kubernetes', Helm: 'helm', Terraform: 'terraform', 'GitHub Actions': 'githubactions', Jenkins: 'jenkins', Nginx: 'nginx', Linux: 'linux',
  AWS: 'amazonwebservices', 'Google Cloud': 'googlecloud', Azure: 'azure', Prometheus: 'prometheus', Grafana: 'grafana',
  MongoDB: 'mongodb', MySQL: 'mysql', Redis: 'redis', SQLite: 'sqlite', RabbitMQ: 'rabbitmq', Neo4j: 'neo4j',
  Git: 'git', GitHub: 'github', 'VS Code': 'vscode', 'Visual Studio': 'visualstudio', 'IntelliJ IDEA': 'intellij', Postman: 'postman',
  Pytest: 'pytest', Vitest: 'vitest', Playwright: 'playwright', Maven: 'maven', Gradle: 'gradle', pnpm: 'pnpm',
};

/** The toolbox cards, in README order (two per row). */
export const STACK = [
  { key: 'languages', title: 'Languages', note: 'what I think in', doodle: 'code', items: ['C#', 'Python', 'TypeScript', 'JavaScript', 'Java', 'Go', 'Dart', 'C++', 'Bash', 'PowerShell'] },
  { key: 'apps', title: 'Apps & games', note: 'web, mobile, Unity', doodle: 'browser', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Three.js', 'HTML', 'CSS', 'Flutter', 'Unity'] },
  { key: 'backend', title: 'Backend', note: 'APIs and services', doodle: 'server', items: ['Node.js', 'Express', 'FastAPI', 'Flask', 'Spring Boot', '.NET', 'Socket.IO'] },
  { key: 'data', title: 'Data & AI', note: 'notebooks to models', doodle: 'flask', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas', 'Jupyter', 'Streamlit', 'XGBoost', 'YOLO'] },
  {
    key: 'devops', title: 'DevOps & Cloud', note: 'where I am heading', doodle: 'cloud',
    items: ['Docker', 'Kubernetes', 'Helm', 'Terraform', 'GitHub Actions', 'Jenkins', 'Nginx', 'Linux', { name: 'AWS', next: true }, { name: 'Google Cloud', next: true }, { name: 'Azure', next: true }, { name: 'Prometheus', next: true }, { name: 'Grafana', next: true }],
  },
  { key: 'stores', title: 'Data stores & tools', note: 'the everyday kit', doodle: 'wrench', items: ['MongoDB', 'MySQL', 'Redis', 'SQLite', 'RabbitMQ', 'Neo4j', 'Git', 'VS Code', 'IntelliJ IDEA', 'Postman', 'Pytest', 'Playwright'] },
];
