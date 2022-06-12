import { useState } from "react";
import { Action, ActionPanel, List, Clipboard, showHUD } from "@raycast/api";
import { isHex } from "./utils";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const hexStringTrimmed = searchText.slice(0, 2) === "0x" ? searchText.slice(2) : searchText;
  const intText = parseInt(hexStringTrimmed, 16);
  const binText = intText.toString(2);
  const asciiText = Buffer.from(hexStringTrimmed, "hex").toString();

  console.log(asciiText);
  return (
    <List searchText={searchText} onSearchTextChange={setSearchText} navigationTitle="Input hex string">
      {(isHex("0x" + hexStringTrimmed)
        ? [
          { key: "int", value: isNaN(intText) ? "" : intText.toString() },
          { key: "ascii", value: asciiText },
          { key: "binary", value: isNaN(intText) ? "" : binText },
        ]
        : []
      ).map((item) => (
        <List.Item
          key={item.key}
          title={item.value}
          subtitle={item.key}
          actions={
            <ActionPanel>
              <Action
                title="Copy to clipboard"
                onAction={async () => {
                  await Clipboard.copy(item.value);
                  await showHUD(`Copied ${item.value} to clipboard`);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
