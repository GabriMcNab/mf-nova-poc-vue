import { mount, config } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaTable, { NovaTableProps } from "./NovaTable.vue";

config.global.mocks = {
  $t: (text: string) => text,
};

const props: NovaTableProps = {
  headers: [
    {
      key: "title",
      label: "title-label",
    },
    {
      key: "id",
      label: "id-label",
    },
  ],
  gridTemplateColumns: "1fr",
  items: [
    {
      title: "4 days trip in Milan",
      id: "aaa",
    },
    {
      title: "0 days trip in Milan",
      id: "bbb",
    },
    {
      title: "-1 day trip in Milan",
      id: "ccc",
    },
    {
      title: "NaN day trip in [object Object]",
      id: "ddd",
    },
  ],
};

const selectors = {
  table: "[data-testid='nova-table']",
  row: "[data-testid='nova-table-row']",
  sort: "[data-testid='nova-table-sort']",
  noItems: "[data-testid='nova-table-no-items-warning']",
  spinner: "[data-testid='nova-spinner']",
};

describe("NovaTable", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(NovaTable, { props });
    expect(NovaTable).toBeTruthy();

    const [titleHeader, idHeader] = wrapper.findAll(".NovaTable__header_cell");
    const items = wrapper.findAll(".NovaTableRow");

    expect(titleHeader.html()).toContain("title-label");
    expect(idHeader.html()).toContain("id-label");

    expect(items.length).toBe(4);
  });

  test("it should render slot content", () => {
    const wrapper = mount(NovaTable, {
      props,
      slots: {
        row: "<div data-testid='custom-row'>Custom row</div>",
      },
    });

    expect(wrapper.find("[data-testid='custom-row']").exists()).toBe(true);
    expect(wrapper.findAll("[data-testid='custom-row']").length).toBe(
      props.items.length
    );
  });

  test("it should emit the correct events", async () => {
    const wrapper = mount(NovaTable, { props });

    const sort = wrapper.find(selectors.sort);
    await sort.trigger("click");

    expect(wrapper.emitted()["update:sort"].toString()).toContain("title");
  });

  test("it should render a warning if there are no items.", () => {
    const wrapper = mount(NovaTable, {
      props: { ...props, items: [] },
    });

    const noItemsWarning = wrapper.find(selectors.noItems);

    expect(noItemsWarning.exists()).toBe(true);
    expect(noItemsWarning.text()).toBe("dashboard.table.no.items.warning");
  });

  describe("when 'loading' is true", () => {
    test("it should show a spinner", () => {
      const wrapper = mount(NovaTable, { props: { ...props, loading: true } });

      expect(wrapper.find(selectors.spinner).exists()).toBe(true);
    });
  });
});
