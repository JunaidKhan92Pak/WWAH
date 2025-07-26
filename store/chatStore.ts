// store/chatStore.ts
import { create } from "zustand";

type ChatStore = {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  isChatOpen: false,
  setIsChatOpen: (open: boolean) => set({ isChatOpen: open }), // Fixed: was setIsChatOpen: open
}));
