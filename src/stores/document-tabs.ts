import { defineStore } from "pinia";

export interface DocumentTab {
  label: string;
  path: string;
}

export interface DocumentTabState {
  tabs: DocumentTab[];
}

export const useDocumentTabs = defineStore("document-tabs", {
  state: (): DocumentTabState => ({
    tabs: [],
  }),
  getters: {
    isOpen: (state) => (path: DocumentTab["path"]) =>
      !!state.tabs.find((tab) => tab.path === path),
    isSelected: () => (path: DocumentTab["path"]) => {
      // using newPath to avoid to lose the selected class of the tab
      const newPath = [path.split("/")[1], path.split("/")[2]].join("/");
      return useRoute().fullPath.includes(newPath);
    },
  },
  actions: {
    addTab(tab: DocumentTab) {
      const splittedPath = tab.path.split("/");

      if (splittedPath[1] === "experience-curation") {
        // check if the tab or the tab/media already exist
        // if one of them already exit we switch them
        // else we push another tab
        const shortPath = "/" + [splittedPath[1], splittedPath[2]].join("/");
        const isMedia = splittedPath[3] === "media";

        const target = this.tabs.findIndex((t) => t.path === tab.path);
        const newPath = isMedia ? shortPath : shortPath + "/media";
        const newTarget = this.tabs.findIndex((t) => t.path === newPath);

        if (target < 0 && newTarget >= 0) {
          this.tabs[newTarget] = tab;
          return;
        }
      }
      this.tabs.push(tab);
    },
    updateTab(tab: DocumentTab) {
      const target = this.tabs.findIndex((t) => t.path === tab.path);

      if (target < 0) {
        throw new Error(`Tab ${tab.path} not present in Document Tabs`);
      }

      this.tabs[target] = {
        ...this.tabs[0],
        ...tab,
      };
    },
    closeTab(path: DocumentTab["path"], removeTab = true) {
      const router = useRouter();

      if (this.tabs.length === 1) {
        return;
      }

      if (this.isSelected(path)) {
        const currentIndex = this.tabs.findIndex((tab) => tab.path === path);

        // when the user wants to close the current tab
        // if it has any siblings on the right, navigate to the first one
        // if not, navigate to the first sibling on the left.
        const rightSibling = this.tabs[currentIndex + 1];
        const leftSibling = this.tabs[currentIndex - 1];
        const nextRoute = rightSibling || leftSibling;

        if (nextRoute) {
          router.push(nextRoute.path);
        }
      }
      if (removeTab) {
        this.tabs = this.tabs.filter((tab) => tab.path !== path);
      }
    },
  },
});
