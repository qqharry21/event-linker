"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";

/**
 * 儲存操作紀錄（ActivityLog）
 */
export async function saveActivityLog(
  action: string,
  metadata: Prisma.InputJsonValue = {},
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("必須登入才能記錄操作紀錄");
    }
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        metadata,
      },
    });
    return {
      status: 201,
      message: "操作紀錄已儲存",
    };
  } catch (error) {
    console.error("儲存操作紀錄失敗", error);
    return {
      status: 500,
      message: "儲存操作紀錄時發生錯誤，請稍後再試",
    };
  }
}
