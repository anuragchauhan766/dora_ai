import { projects, users } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type SelectProject = InferSelectModel<typeof projects>;
export type InsertProject = InferInsertModel<typeof projects>;
export type ProjectWithDocCount = SelectProject & {
  documentCounts: number;
};
