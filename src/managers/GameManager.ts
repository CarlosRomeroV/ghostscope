export class GameManager {
    private startTime: number;
    private sanity: number = 100;
  
    constructor() {
      this.startTime = Date.now();
    }
  
    getTimeElapsed(): number {
      return Math.floor((Date.now() - this.startTime) / 1000);
    }
  
    getSanity(): number {
      return this.sanity;
    }
  
    reduceSanity(amount: number) {
      this.sanity = Math.max(0, this.sanity - amount);
    }
  
    reset() {
      this.startTime = Date.now();
      this.sanity = 100;
    }
  }
  