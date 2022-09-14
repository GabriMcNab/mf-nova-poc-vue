import { defineStore } from "pinia";

interface UserStoreState {
  user_uuid: string;
}

export const useUser = defineStore("user", {
  state: (): UserStoreState => ({ user_uuid: "" }),
});
