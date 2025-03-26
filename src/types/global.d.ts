import * as Types from "@prisma/client";

export { Types };

export {};
declare global {
  interface PropsWithChildren {
    children: React.ReactNode | React.ReactNode[];
  }

  interface Event extends Types.Event {
    participation: {
      user: {
        id: string;
        displayName: string;
        avatarUrl?: string;
      };
      status: "PENDING" | "ACCEPTED" | "DECLINED";
    }[];
  }
}
