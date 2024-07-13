// src/utils/jsonStorage.ts

interface EmailStatus {
  [address: string]: {
    lastSent: string;
    taskId: string;
  };
}

const STORAGE_KEY = 'emailSendStatus';

function getEmailStatus(): EmailStatus {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : {};
}

function setEmailStatus(data: EmailStatus): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function hasEmailBeenSent(address: string): boolean {
  const data = getEmailStatus();
  return !!data[address];
}

export function markEmailAsSent(address: string, taskId: string): void {
  const data = getEmailStatus();
  data[address] = {
    lastSent: new Date().toISOString(),
    taskId,
  };
  setEmailStatus(data);
}

export function clearEmailSendStatus(): void {
  localStorage.removeItem(STORAGE_KEY);
}