import { documentStatus } from "@/db/schema";

export type DocumentStatus = (typeof documentStatus.enumValues)[number];