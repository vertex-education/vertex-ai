import { AsyncLocalStorage } from "node:async_hooks";

const executionContextStorage = new AsyncLocalStorage<ExecutionContext>();

export function runWithCloudflareExecutionContext<T>(ctx: ExecutionContext, callback: () => T) {
  return executionContextStorage.run(ctx, callback);
}

export function getCloudflareExecutionContext() {
  return executionContextStorage.getStore();
}
