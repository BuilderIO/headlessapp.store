import { useState, For } from "@jsx-lite/core";

export default function MyComponent() {
  const state = useState({
    list: [{ text: "hello" }, { text: "world" }],
    newItemName: "New item",
    addItem() {
      state.list = [...state.list, { text: state.newItemName }];
    },
  });

  return (
    <div css={{ padding: "10px" }}>
      <link
        href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <input
        class="shadow-md rounded w-full px-4 py-2"
        value={state.newItemName}
        onChange={(event) => (state.newItemName = event.target.value)}
      />
      <button
        class="bg-blue-500 rounded w-full text-white font-bold py-2 px-4 "
        css={{ margin: "10px 0" }}
        onClick={() => state.addItem()}
      >
        Add list item
      </button>
      <div class="shadow-md rounded">
        <For each={state.list}>
          {(item) => (
            <div class="border-gray-200 border-b" css={{ padding: "10px" }}>
              {item.text}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
