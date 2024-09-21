import React from "react";
import { createRoot } from "react-dom/client";
import SeoPannel from "./seo"
function myCustomPlugin(editor, param) {
  console.log("custom", 
    param
  )
  editor.Commands.add("open-seo", {
    run: (editor, sender, options) => {
      const existingPanel = document.getElementById("custom-panel");
      if (existingPanel) {
        existingPanel.style.display = "block";
        return;
      }
      const viewsPanel = editor.Panels.getPanel("views");
      if (viewsPanel) {
        const panelContainer = document.createElement("div");
        panelContainer.id = "custom-panel";
        panelContainer.style.maxHeight = "calc(100vh - 55px)"
        panelContainer.style.overflowY = "scroll"

        viewsPanel.set("appendContent", panelContainer.outerHTML);
        if (existingPanel) {
          viewsPanel.trigger("change:appendContent");
        }
      }

      const container = document.getElementById("custom-panel");
      const root = createRoot(container); 
      root.render(<SeoPannel id={param.id}/>);
    },
    stop: (editor, sender, options) => {
      const customPanel = document.getElementById("custom-panel");
      if (customPanel) {
        customPanel.style.display = "none";
      }
    },
  });
}

export { myCustomPlugin };
