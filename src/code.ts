figma.showUI(__html__, { themeColors: true, height: 400 });

const { selection } = figma.currentPage;

function hasValidSelection(nodes: readonly SceneNode[]) {
  return !(!nodes || nodes.length === 0);
}

const sendToUi = async (e: Uint8Array[]) => {
  figma.ui.postMessage({ type: 'exportPDF', data: e });
};

const sendImageToUi = async (imageData: Uint8Array) => {
  figma.ui.postMessage({ type: 'exportImage', data: imageData });
};

async function set(nodes: any): Promise<string> {
  const settings = [{ format: 'PDF', suffix: '' }];
  if (!hasValidSelection(nodes)) return Promise.resolve('No valid selection');

  for (let node of nodes) {
    node.exportSettings = settings;
  }

  return Promise.resolve('Done!');
}

figma.ui.onmessage = async (msg) => {
  let exportNode: SceneNode = figma.currentPage.selection[0];
  exportNode === undefined && figma.notify('No selection');

  try {
    const resolved = await exportNode.exportAsync({
      format: 'PNG',
      constraint: {
        type: 'WIDTH',
        value: 280,
      },
    });
    if (resolved !== undefined) {
      sendImageToUi(resolved);
    } else {
      console.error('Export resolved value is undefined');
    }
  } catch (error) {
    console.error(error);
  }

  if (msg.type === 'EXPORT') {
    const nodes = figma.currentPage.selection;
    const textNodes = figma.root.findAll((child) => child.type === 'TEXT') as TextNode[];
    for (let textNode of textNodes) {
      await figma.loadFontAsync((textNode as TextNode).fontName as FontName);
    }

    if (!hasValidSelection(nodes)) return Promise.resolve('No valid selection');

    const exportArray = [];
    for (let node of nodes) {
      try {
        const bytes = await node.exportAsync({
          format: 'PDF',
          contentsOnly: true,
        });
        exportArray.push(bytes);
      } catch (error) {
        console.error(error);
      }
    }

    set(nodes);
    sendToUi(exportArray);
    figma.root.setRelaunchData({ relaunch: '' });
  }
};

figma.on('run', async () => {
  figma.ui.postMessage({ type: 'pageCount', data: figma.currentPage.selection.length });

  let exportNode: SceneNode = figma.currentPage.selection[0];
  exportNode === undefined && figma.notify('No selection');

  try {
    const resolved = await exportNode.exportAsync({
      format: 'PNG',
      constraint: {
        type: 'WIDTH',
        value: 280,
      },
    });
    if (resolved !== undefined) {
      sendImageToUi(resolved);
    } else {
      console.error('Export resolved value is undefined');
    }
  } catch (error) {
    console.error(error);
  }
});

figma.on('selectionchange', async () => {
  figma.ui.postMessage({ type: 'pageCount', data: figma.currentPage.selection.length });

  let exportNode: SceneNode = figma.currentPage.selection[0];
  exportNode === undefined && figma.notify('No selection');

  try {
    const resolved = await exportNode.exportAsync({
      format: 'PNG',
      constraint: {
        type: 'WIDTH',
        value: 280,
      },
    });
    if (resolved !== undefined) {
      sendImageToUi(resolved);
    } else {
      console.error('Export resolved value is undefined');
    }
  } catch (error) {
    console.error(error);
  }
});
