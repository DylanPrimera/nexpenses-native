import { onlineManager } from "@tanstack/react-query";

let userId: string | undefined;
let generation = 0;
let replayReady = false;
let connected = false;
const controllers = new Set<AbortController>();

export class ExpenseSessionError extends Error {}

export function getQuerySession() {
  return { userId, generation };
}
export function setPhysicalConnectivity(value: boolean) {
  connected = value;
  onlineManager.setOnline(connected && replayReady);
}
export function setQueryNetworkReady(value: boolean) {
  replayReady = value;
  onlineManager.setOnline(connected && replayReady);
}
export function openQuerySession(id?: string) {
  if (id === userId) return;
  closeQuerySession();
  userId = id;
}
export function closeQuerySession() {
  generation += 1;
  userId = undefined;
  setQueryNetworkReady(false);
  controllers.forEach((controller) => controller.abort());
  controllers.clear();
}
export function assertQuerySession(id: string, version = generation) {
  if (userId !== id || generation !== version) throw new ExpenseSessionError();
}
export function createExpenseRequest(id: string) {
  assertQuerySession(id);
  const version = generation;
  const controller = new AbortController();
  controllers.add(controller);
  return { controller, version, release: () => controllers.delete(controller) };
}
