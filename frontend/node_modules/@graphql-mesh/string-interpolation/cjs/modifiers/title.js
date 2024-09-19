"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titlecase = void 0;
const titlecase = value => value.replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase());
exports.titlecase = titlecase;
