export function createOptimisticId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function mutationFailureMessage(action: string, point: string, error: unknown) {
  const detail =
    error instanceof Error
      ? error.message
      : typeof error === "string" && error.trim()
        ? error.trim()
        : "The server did not return a failure detail.";
  return `${action} failed at ${point}: ${detail}`;
}

export async function runServerMutation<T>(action: string, mutation: () => Promise<T>) {
  try {
    return await mutation();
  } catch (error) {
    throw new Error(mutationFailureMessage(action, "server mutation", error), { cause: error });
  }
}
