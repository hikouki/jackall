export const JACKALL_ERROR_CODE = {
  NOMATCH_VERSION: "Version don't match." as const,
  FAILED_ASYNCTASK: "Failed to async task." as const,
};

interface JackallOK<T> {
  ok: true;
  value: T;
}

interface JackallNG {
  ok: false;
  code: Exclude<
    typeof JACKALL_ERROR_CODE[keyof typeof JACKALL_ERROR_CODE],
    typeof JACKALL_ERROR_CODE.FAILED_ASYNCTASK
  >;
  value: Error;
}

interface JackallExpectedNG<T> {
  ok: false;
  code: typeof JACKALL_ERROR_CODE.FAILED_ASYNCTASK;
  value: T;
}

type JackallResult<T> = JackallOK<T> | JackallNG | JackallExpectedNG<T>;

class Jackall<T extends string> {
  private resources: {
    [K in T]?: {
      version: number;
      living: boolean /* TODO: Sweep. */;
    };
  } = {};

  constructor() {}

  async acquire<A>(key: T, d: Promise<A>): Promise<JackallResult<A>> {
    const version = this.increment(key);

    const res = await this.wait(d);

    this.kill(key);

    if (version !== this.getVersion(key)) {
      return {
        ok: false,
        code: JACKALL_ERROR_CODE.NOMATCH_VERSION,
        value: new Error(`Jackall Error: ${JACKALL_ERROR_CODE.NOMATCH_VERSION}`),
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        code: JACKALL_ERROR_CODE.FAILED_ASYNCTASK,
        value: res.value,
      };
    }

    return {
      ok: true,
      value: res.value,
    };
  }

  private async wait<A>(
    d: Promise<A>
  ): Promise<{ ok: true; value: A } | { ok: false; value: any }> {
    try {
      return {
        ok: true,
        value: await d,
      };
    } catch (e) {
      return {
        ok: false,
        value: e,
      };
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

export const jackall = new Jackall<string>();

export const makeJackall = <T extends string>() => new Jackall<T>();
