/**
 * The editor's own behaviours. Importing this file registers them in the
 * engine's ObjectInstanciator, so scenes that use them load with them (and
 * keep them when saved). Imported for its side effect by EditorService.
 */
export * from './rotate';
export * from './sun-behaviour';
