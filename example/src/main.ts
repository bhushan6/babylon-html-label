import { Experience } from "./Experience";
import "./style.css";

const canvas = document.getElementsByTagName("canvas")[0];

if (!canvas) throw new Error("Canvas element not found");

new Experience(canvas);
