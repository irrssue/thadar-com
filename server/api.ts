import "server-only";
import { NextResponse } from "next/server";
import { auth } from "./auth";

/** Canonical API envelope used by every route handler (CLAUDE.md code style). */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, { status });
}

export function fail(error: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error },
    { status },
  );
}

/**
 * Resolve the current user id from the session, or return a 401 response.
 * Usage:
 *   const gate = await requireUser();
 *   if (!gate.ok) return gate.response;
 *   const userId = gate.userId;
 */
export async function requireUser(): Promise<
  { ok: true; userId: string } | { ok: false; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, response: fail("Unauthorized", 401) };
  }
  return { ok: true, userId: session.user.id };
}

/** Safely parse a JSON request body; returns undefined on malformed input. */
export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}
