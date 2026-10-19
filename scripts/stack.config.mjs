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

/**
 * The featured card, first in the stack and full width because it is where I'm heading: my pipeline
 * drawn as a road, stop by stop, then the cloud I'm learning next. Rendered by assets/devops.mjs.
 */
export const DEVOPS = {
  key: 'devops', title: 'DevOps & Cloud', note: "the road I'm on: from writing code to shipping and running it", doodle: 'cloud', tag: 'main quest',
  stops: [
    { label: 'push', items: ['Git'] },
    { label: 'CI gates', items: ['GitHub Actions', 'Jenkins'], note: '+ Trivy, gitleaks, CodeQL' },
    { label: 'package', items: ['Docker'], note: 'built in CI' },
    { label: 'provision', items: ['Terraform'], note: 'infra as code' },
    { label: 'deploy', items: ['Kubernetes', 'Helm'] },
    { label: 'serve', items: ['Nginx', 'Linux'] },
  ],
  here: 'you are here',
  next: { title: 'next on the road', note: 'learning these now', items: ['AWS', 'Google Cloud', 'Azure', 'Prometheus', 'Grafana'] },
};

/**
 * The toolbox cards under it, in README order (two per row, so pairs keep the same height).
 * `scene` picks the little moving scene in the header corner (assets/vignettes.mjs).
 */
export const STACK = [
  { key: 'languages', title: 'Languages', note: 'what I think in', doodle: 'code', items: ['C#', 'Python', 'TypeScript', 'JavaScript', 'Java', 'Go', 'Dart', 'C++', 'Bash', 'PowerShell'], scene: { kind: 'typing', snippets: [['Python', 'print("hello")'], ['Go', 'fmt.Println("hi")'], ['C#', 'Debug.Log("hi");'], ['TypeScript', 'console.log("hi")']] } },
  { key: 'apps', title: 'Apps & games', note: 'web, mobile, Unity', doodle: 'browser', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Three.js', 'HTML', 'CSS', 'Flutter', 'Unity'], scene: 'browser' },
  { key: 'backend', title: 'Backend', note: 'APIs, services, queues', doodle: 'server', items: ['Node.js', 'Express', 'FastAPI', 'Flask', 'Spring Boot', '.NET', 'Socket.IO', 'RabbitMQ'], scene: 'packets' },
  { key: 'data', title: 'Data & AI', note: 'notebooks to models', doodle: 'flask', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas', 'Jupyter', 'Streamlit', 'XGBoost', 'YOLO'], scene: 'training' },
  { key: 'stores', title: 'Databases', note: 'where the data lives', doodle: 'database', items: ['MongoDB', 'MySQL', 'Redis', 'SQLite', 'Neo4j'], scene: 'sync' },
  { key: 'tools', title: 'Everyday tools', note: 'editors and testing', doodle: 'wrench', items: ['VS Code', 'IntelliJ IDEA', 'Postman', 'Pytest', 'Playwright'], scene: 'checklist' },
];
