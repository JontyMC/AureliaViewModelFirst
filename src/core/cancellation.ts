export class CancellationToken {
  public static readonly none = new CancellationToken();

  constructor(private cts?: CancellationTokenSource) { }

  register(callback: () => void) {
    this.cts._register(callback);
  }

  public get isCancellationRequested(): boolean {
    return this.cts?.isCancellationRequested;
  }
}

export class CancellationTokenSource {
  isCancellationRequested: boolean;
  callbacks: (() => void)[] = [];
  token = new CancellationToken(this);

  cancel() {
    this.isCancellationRequested = true;
    this.callbacks.forEach(c => c());
    this.callbacks = [];
  }

  _register(callback: () => void) {
    this.callbacks.push(callback);
  }
}
