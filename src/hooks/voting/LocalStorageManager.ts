class LocalStorageManager {
  projectId: string;
  prefix: string;

  constructor(projectId: string) {
    this.projectId = projectId;
    this.prefix = projectId + "name";
  }

  setVoted(name: string, categories: string[]) {
    const sorted = categories.sort();
    let asString = "";
    for (let i = 0; i < categories.length; i++) {
      asString += sorted[i];
    }
    localStorage.setItem(this.prefix + asString, name);
  }
  getVoted(categories: string[]): string | null {
    const sorted = categories.sort();
    let asString = "";
    for (let i = 0; i < categories.length; i++) {
      asString += sorted[i];
    }
    return localStorage.getItem(this.prefix + asString);
  }
}
export { LocalStorageManager };
