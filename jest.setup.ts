import { TextEncoder, TextDecoder } from "node:util";
import "jest-canvas-mock";

Object.assign(global, { TextDecoder, TextEncoder });
