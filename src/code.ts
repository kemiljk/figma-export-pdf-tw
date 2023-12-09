figma.showUI(__html__, { themeColors: true, height: 464 });

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
    // const textNodes = figma.currentPage.findAll((child) => child.type === 'TEXT') as TextNode[];
    // if (textNodes.length > 0) {
    //   for (let textNode of textNodes) {
    //     await figma.loadFontAsync((textNode as TextNode).fontName as FontName);
    //   }
    // }

    if (!hasValidSelection(nodes)) return Promise.resolve('No valid selection');

    let sortedNodes: SceneNode[];
    switch (msg.order) {
      case 'canvas':
        sortedNodes = [...nodes].sort((a, b) => {
          const yDiff = a.y - b.y;
          if (yDiff !== 0) return yDiff;
          return a.x - b.x;
        });

        break;
      case 'number':
        sortedNodes = [...nodes].sort((a, b) => {
          const aNumber = a.name.match(/\d+/g) ? parseInt(a.name.match(/\d+/g)[0], 10) : 0;
          const bNumber = b.name.match(/\d+/g) ? parseInt(b.name.match(/\d+/g)[0], 10) : 0;
          return aNumber - bNumber;
        });
        break;
      default:
        // Default to 'Creation date'
        sortedNodes = [...nodes];
        break;
    }

    const exportArray = [];
    for (let node of sortedNodes) {
    // for (let node of nodes) {
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

    set(sortedNodes);
    // set(nodes);
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
