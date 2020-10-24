# Jackall

![CI](https://github.com/hikouki/jackall/workflows/CI/badge.svg)

async/await for optimistic concurrency control. (Last in wins.)

## Install

```
npm install jackall
```

## Usage

Please refer to [tests](https://github.com/hikouki/jackall/blob/main/__tests__/index.spec.ts).

```typescript
import { jackall } from "jackall";

// async tasks.
const task1 = async () => new Promise((ok) => setTimeout(ok, 100, "ping1"));
const task2 = async () => new Promise((ok) => setTimeout(ok, 200, "ping2"));

// jackall.acquire. (resource name is `tiger`)
const [act1, act2] = await Promise.all([
  jackall.acquire("tiger", task1()),
  jackall.acquire("tiger", task2()),
]);

// last in wins.
// act1 => { ok: false, code: JACKALL_ERROR_CODE.NOMATCH_VERSION, value: new Error(`Jackall Error: ${JACKALL_ERROR_CODE.NOMATCH_VERSION}`) }
// act2 => { ok: true, value: "ping2" }
```

If you want to specify a resource name.

```typescript
import { makeJackall } from "jackall";

const jackall = makeJackall<"tiger">();

// jackall.acquire("tiger", task1()) => OK
// jackall.acquire("bear", task1()) => NG
```

## Error Codes

```typescript
import { JACKALL_ERROR_CODE } from "jackall";
```

| option             | description                                 |
|--------------------|---------------------------------------------|
| FAILED_ASYNCTASK   | Failed to Async task.                       |
| NOMATCH_VERSION    | Lost in the race conditions.(Last in Wins.) |

## License

Jackall is [MIT licensed](https://github.com/hikouki/jackall/blob/main/LICENSE).
