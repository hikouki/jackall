import { jackall, JACKALL_ERROR_CODE, makeJackall } from "../";

describe("jackall", () => {
  it("Single task.", async () => {
    const task = async () => new Promise((ok) => setTimeout(ok, 100, "ping"));
    const act = await jackall.acquire("tiger", task());
    expect(act).toStrictEqual({ ok: true, value: "ping" });
  });

  it("Conflict.", async () => {
    const task1 = async () => new Promise((ok) => setTimeout(ok, 200, "ping1"));
    const task2 = async () => new Promise((ok) => setTimeout(ok, 100, "ping2"));

    const [act1, act2] = await Promise.all([
      jackall.acquire("tiger", task1()),
      jackall.acquire("tiger", task2()),
    ]);

    expect(act1).toStrictEqual({
      ok: false,
      code: JACKALL_ERROR_CODE.NOMATCH_VERSION,
      value: new Error(`Jackall Error: ${JACKALL_ERROR_CODE.NOMATCH_VERSION}`),
    });
    expect(act2).toStrictEqual({ ok: true, value: "ping2" });
  });

  it("No Conflict.", async () => {
    const task1 = async () => new Promise((ok) => setTimeout(ok, 100, "ping1"));
    const task2 = async () => new Promise((ok) => setTimeout(ok, 200, "ping2"));

    const [act1, act2] = await Promise.all([
      jackall.acquire("bear", task1()),
      jackall.acquire("tiger", task2()),
    ]);

    expect(act1).toStrictEqual({ ok: true, value: "ping1" });
    expect(act2).toStrictEqual({ ok: true, value: "ping2" });
  });

  it("Conflict and failed task.", async () => {
    const task1 = async (): Promise<string> =>
      new Promise((ok) => setTimeout(ok, 100, "ping1"));
    const task2 = async (): Promise<string | "ping2-ng"> =>
      new Promise((_, ng) => setTimeout(ng, 200, "ping2-ng"));

    const [act1, act2] = await Promise.all([
      jackall.acquire("tiger", task1()),
      jackall.acquire("tiger", task2()),
    ]);

    expect(act1).toStrictEqual({
      ok: false,
      code: JACKALL_ERROR_CODE.NOMATCH_VERSION,
      value: new Error(`Jackall Error: ${JACKALL_ERROR_CODE.NOMATCH_VERSION}`),
    });
    expect(act2).toStrictEqual({
      ok: false,
      code: JACKALL_ERROR_CODE.FAILED_ASYNCTASK,
      value: "ping2-ng",
    });
  });

  it("Conflict and throw Error task.", async () => {
    const task1 = async (): Promise<string> =>
      new Promise((ok) => setTimeout(ok, 100, "ping1"));
    const task2 = async (): Promise<string> =>
      new Promise(() => {
        throw new Error("critical");
      });

    const [act1, act2] = await Promise.all([
      jackall.acquire("tiger", task1()),
      jackall.acquire("tiger", task2()),
    ]);

    expect(act1).toStrictEqual({
      ok: false,
      code: JACKALL_ERROR_CODE.NOMATCH_VERSION,
      value: new Error(`Jackall Error: ${JACKALL_ERROR_CODE.NOMATCH_VERSION}`),
    });

    expect(act2).toStrictEqual({
      ok: false,
      code: JACKALL_ERROR_CODE.FAILED_ASYNCTASK,
      value: new Error("critical"),
    });
  });
});

describe("makeJackall", () => {
  it("#make", async () => {
    const ja = makeJackall<"test">();
    const task = async () => new Promise((ok) => setTimeout(ok, 100, "ping"));
    const act = await ja.acquire("test", task());
    expect(act).toStrictEqual({ ok: true, value: "ping" });
  });
});
