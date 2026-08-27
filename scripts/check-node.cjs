const major = Number.parseInt(process.versions.node.split(".")[0], 10);

if (major !== 24) {
  console.error(
    `\nThis project requires Node.js 24 (see .nvmrc). Current: ${process.version}\n` +
      "Use the nvm copy of Node, then retry:\n" +
      "  nvm install\n" +
      "  nvm use\n",
  );
  process.exit(1);
}
