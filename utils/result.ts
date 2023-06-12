export type Result<T, E> = Ok<T> | Err<E>;

export type Ok<T> = {
  success: true;
  value: T;
};

export type Err<E> = {
  success: false;
  error: E;
};

export function ok<T>(value: T): Ok<T> {
  return { success: true, value };
}

export function err<E>(error: E): Err<E> {
  return { success: false, error };
}

export function resultify<T, E>(fn: () => T): Result<T, E> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error);
  }
}

export function resultifyAsync<T, E>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  return promise.then(ok, err);
}
