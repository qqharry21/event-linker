import * as Types from "@prisma/client";

export { Types };

export {};
declare global {
  interface PropsWithChildren {
    children: React.ReactNode | React.ReactNode[];
  }

  interface ParticipationWithUser extends Types.EventParticipation {
    user: Types.User;
  }

  interface EventWithParticipation extends Types.Event {
    participation: ParticipationWithUser[];
  }

  interface EventWithCreator extends Types.Event {
    createdBy: Types.User;
  }
}
