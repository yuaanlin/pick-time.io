import { createContext, useContext } from 'react';

export interface SessionContextType {
  events: {
    [nanoid: string]: {
      name: string;
      token: string;
    }
  };
  updateSession: (nanoid: string, name: string, token: string) => void;
}

export const SessionContext = createContext<SessionContextType>({
  events: {},
  updateSession: () => undefined
});

function useSession(nanoid: string) {
  const ctx = useContext(SessionContext);
  return ctx.events[nanoid];
}

export function useUpdateSession() {
  return useContext(SessionContext).updateSession;
}

export default useSession;
