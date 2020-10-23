export const JaoccErrorCode = {
  NOMATCH_VERSION: "Version don't match." as const,
  FAILED_ASYNCTASK: "Failed to async task." as const,
};

interface JaoccOK<T> {
  ok: true;
  value: T;
}

interface JaoccNG {
  ok: false;
  code: typeof JaoccErrorCode[keyof typeof JaoccErrorCode];
  value: Error;
}

type JaoccResult<T> = JaoccOK<T> | JaoccNG;

class Jaocc<T extends string> {
  private resources: {
    [K in T]?: {
      version: number;
      living: boolean;
    };
  } = {};

  constructor() {}

  async acquire<A>(key: T, d: Promise<A>): Promise<JaoccResult<A>> {
    const version = this.increment(key);

    const res = await this.wait(d);

    this.kill(key);

    if (version !== this.getVersion(key)) {
      return {
        ok: false,
        code: JaoccErrorCode.NOMATCH_VERSION,
        value: new Error(""),
      };
    }

    if (res instanceof Error) {
      return {
        ok: false,
        code: JaoccErrorCode.FAILED_ASYNCTASK,
        value: res,
      };
    }

    return {
      ok: true,
      value: res,
    };
  }

  private async wait<A>(d: Promise<A>): Promise<A | Error> {
    try {
      return await d;
    } catch (e) {
      return e;
    }
  }

  private getVersion(key: T): number {
    const res = this.resources[key];
    return res?.version || 0;
  }

  private increment(key: T) {
    const version = this.getVersion(key) + 1;
    this.resources[key] = {
      version,
      living: true,
    };
    return version;
  }

  private kill(key: T) {
    const res = this.resources[key];
    this.resources[key] = {
      ...res,
      living: false,
    };
  }
}

export const jaocc = new Jaocc<string>();
