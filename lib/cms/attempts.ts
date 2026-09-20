import "server-only";
import type { TestAnswer, TestContent } from "./types";
import { auth } from "../auth";
import { graphql } from "../graphql/server";
import { attemptOperations } from "../../features/tests/graphql/operations";
export interface SavedAttempt {
  id: string;
  slug: string;
  name: string;
  at: string;
  values: TestAnswer[];
  snapshot: TestContent;
  summary: string;
}
export async function userAttempts(user: string): Promise<SavedAttempt[]> {
  const session = await auth();
  if (!session?.user.id || session.user.id !== user) return [];
  return (
    await graphql<{ contentTestAttempts: SavedAttempt[] }>(
      attemptOperations.list,
      {},
      session.user,
    )
  ).contentTestAttempts;
}
