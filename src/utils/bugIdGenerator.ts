class BugIdGenerator {
  private static instance: BugIdGenerator;
  private currentId: number = 0;

  private constructor() {}

  public static getInstance(): BugIdGenerator {
    if (!BugIdGenerator.instance) {
      BugIdGenerator.instance = new BugIdGenerator();
    }
    return BugIdGenerator.instance;
  }

  public getNextId(): string {
    this.currentId++;
    return `BUG-${this.currentId.toString().padStart(3, '0')}`;
  }

  public setCurrentId(id: number): void {
    this.currentId = id;
  }
}

export const bugIdGenerator = BugIdGenerator.getInstance();