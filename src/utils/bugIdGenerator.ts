import * as fs from 'fs';
import * as path from 'path';

class BugIdGenerator {
  private static instance: BugIdGenerator;
  private currentId: number = 0;
  private counterFile: string = path.join(process.cwd(), 'bug-counter.json');

  private constructor() {
    this.loadCounter();
  }

  public static getInstance(): BugIdGenerator {
    if (!BugIdGenerator.instance) {
      BugIdGenerator.instance = new BugIdGenerator();
    }
    return BugIdGenerator.instance;
  }

  private loadCounter(): void {
    try {
      if (fs.existsSync(this.counterFile)) {
        const data = fs.readFileSync(this.counterFile, 'utf-8');
        const parsed = JSON.parse(data);
        this.currentId = parsed.currentId || 0;
        console.log(`Loaded bug counter: ${this.currentId}`);
      }
    } catch (error) {
      console.error('Error loading bug counter, starting from 0:', error);
      this.currentId = 0;
    }
  }

  private saveCounter(): void {
    try {
      fs.writeFileSync(this.counterFile, JSON.stringify({ currentId: this.currentId }));
    } catch (error) {
      console.error('Error saving bug counter:', error);
    }
  }

  public getNextId(): string {
    this.currentId++;
    this.saveCounter();
    return `BUG-${this.currentId.toString().padStart(3, '0')}`;
  }

  public setCurrentId(id: number): void {
    this.currentId = id;
    this.saveCounter();
  }

  public getCurrentCount(): number {
    return this.currentId;
  }
}

export const bugIdGenerator = BugIdGenerator.getInstance();