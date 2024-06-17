# Babylon-html-label

`Babylon-html-label` is a library for Babylon.js that allows you to create HTML elements synchronized with 3D positions within the scene. This can be useful for labels, tooltips, or any HTML content that needs to follow a 3D object.

## Installation

To install this package, use npm:

```bash
npm install Babylon-html-label
```

## Usage

### Importing the Class

```typescript
import { HTML2DLabel } from "Babylon-html-label";
import { Scene, Vector3 } from "@babylonjs/core";
```

### Creating an HTML2DLabel

```typescript
const labelElement = document.createElement("div");
labelElement.innerText = "Hello, World!";

const html2DLabel = new HTML2DLabel(
  "myLabel",
  {
    htmlElement: labelElement,
    center: true,
    onCameraMoveOnly: false,
    distanceFactor: 1.0,
  },
  scene
);

html2DLabel.position = new Vector3(0, 1, 0);
scene.addMesh(html2DLabel);
```

### Parameters

- `name: string`
  - The name of the label.
- `options: object`
  - `htmlElement: HTMLElement`: The HTML element to attach.
  - `center?: boolean`: Center the HTML element (default: `false`).
  - `onCameraMoveOnly?: boolean`: Update position only when the camera moves (default: `false`).
  - `el?: string`: The HTML element tag to create (default: `div`).
  - `distanceFactor?: number`: Scale factor based on distance from the camera (default: `1`).
- `scene: Scene`
  - The Babylon.js scene.

### Dispose

```typescript
html2DLabel.dispose();
```

Disposes the HTML2DLabel and removes the HTML element from the DOM.
