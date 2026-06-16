import { describe, expect, it } from "vitest";
import { nextTick } from "vue";

import { withSetup } from "../../test-utils/with-setup";

import { useScrollList } from "../src/use-scroll-list";

describe("use-scroll-list", () => {
  it("能正确加载出数据", async () => {
    const testRecords = ["1", "2", "3"];

    const [{ records }] = await withSetup(() =>
      useScrollList({
        fetchData: async () => {
          return {
            records: testRecords,
            total: testRecords.length,
          };
        },
      }),
    );

    expect(records.value).toEqual(testRecords);
  });

  it("翻页后, 能正常添加数据到records中", async () => {
    const page1Records = ["1", "2", "3"];
    const page2Records = ["4", "5"];
    const results = page1Records.concat(page2Records);
    const total = page1Records.length + page2Records.length;

    const [{ records, next }] = await withSetup(() =>
      useScrollList({
        defaultPageSize: 3,
        fetchData: async ({ pageNum }) => {
          if (pageNum === 1) {
            return {
              records: page1Records,
              total,
            };
          }

          return {
            records: page2Records,
            total,
          };
        },
      }),
    );

    expect(records.value).toEqual(page1Records);

    await next();

    expect(records.value).toEqual(results);
  });

  it("向前翻页, records能返回上一页的数据", async () => {
    const page1Records = ["1", "2", "3"];
    const page2Records = ["4", "5"];
    const results = page1Records.concat(page2Records);
    const total = page1Records.length + page2Records.length;

    const [{ records, next, previous }] = await withSetup(() =>
      useScrollList({
        defaultPageSize: 3,
        fetchData: async ({ pageNum }) => {
          if (pageNum === 1) {
            return {
              records: page1Records,
              total,
            };
          }

          return {
            records: page2Records,
            total,
          };
        },
      }),
    );

    expect(records.value).toEqual(page1Records);

    await next();

    expect(records.value).toEqual(results);

    await previous();

    expect(records.value).toEqual(page1Records);
  });

  it("重置之后, records恢复到第一页", async () => {
    const page1Records = ["1", "2", "3"];
    const page2Records = ["4", "5"];
    const results = page1Records.concat(page2Records);
    const total = page1Records.length + page2Records.length;

    const [{ records, next, reset, pageNum }] = await withSetup(() =>
      useScrollList({
        defaultPageSize: 3,
        fetchData: async ({ pageNum }) => {
          if (pageNum === 1) {
            return {
              records: page1Records,
              total,
            };
          }

          return {
            records: page2Records,
            total,
          };
        },
      }),
    );

    expect(records.value).toEqual(page1Records);

    await next();

    expect(records.value).toEqual(results);

    await reset();

    expect(pageNum.value).toEqual(1);
    expect(records.value).toEqual(page1Records);
  });

  it("刷新之后, records将保持不变", async () => {
    const page1Records = ["1", "2", "3"];
    const page2Records = ["4", "5"];
    const results = page1Records.concat(page2Records);
    const total = page1Records.length + page2Records.length;

    const [{ records, pageNum, next, refresh }] = await withSetup(() =>
      useScrollList({
        defaultPageSize: 3,
        fetchData: async ({ pageNum }) => {
          if (pageNum === 1) {
            return {
              records: page1Records,
              total,
            };
          }

          return {
            records: page2Records,
            total,
          };
        },
      }),
    );

    await nextTick();
    await nextTick();

    expect(records.value).toEqual(page1Records);

    await next();

    expect(records.value).toEqual(results);

    await refresh();

    expect(pageNum.value).toEqual(2);
    expect(records.value).toEqual(results);
  });

  it("当没有更多数据时，再往后翻页，将无法继续翻页", async () => {
    const fragments = [
      ["1", "2", "3"],
      ["4", "5", "6"],
    ];
    const results = fragments.reduce((results, fragment) => {
      return results.concat(fragment);
    }, []);
    const total = fragments.reduce((sum, fragment) => {
      return sum + fragment.length;
    }, 0);

    const [{ records, next, pageNum, isNotMore }] = await withSetup(() =>
      useScrollList({
        defaultPageSize: 3,
        fetchData: async ({ pageNum }) => {
          return {
            records: fragments[pageNum - 1],
            total,
          };
        },
      }),
    );

    expect(pageNum.value).toEqual(1);
    expect(records.value).toEqual(fragments[pageNum.value - 1]);

    await next();

    expect(pageNum.value).toEqual(2);
    expect(records.value).toEqual(results);
    expect(isNotMore.value).toBeTruthy();

    await next();

    expect(pageNum.value).toEqual(2);
    expect(records.value).toEqual(results);
    expect(isNotMore.value).toBeTruthy();
  });
});
