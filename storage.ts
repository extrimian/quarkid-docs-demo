import { readFileSync, writeFileSync, existsSync } from "fs";
import { KMSStorage } from "@quarkid/kms-core";
import { MessageStorage } from "@extrimian/dwn-client";
import { Entry } from "@extrimian/dwn-client/dist/types/message";

export class FileSystemKMSSecureStorage implements KMSStorage {
  public readonly filepath: string;

  constructor(params: { filepath: string }) {
    this.filepath = params.filepath;
  }

  async add(key: string, data: any): Promise<void> {
    const map = this.getData();
    map.set(key, data);
    this.saveData(map);
  }

  async get(key: string): Promise<any> {
    return this.getData().get(key);
  }

  async getAll(): Promise<Map<string, any>> {
    return this.getData();
  }

  update(key: string, data: any) {
    const map = this.getData();
    map.set(key, data);
    this.saveData(map);
  }

  remove(key: string) {
    const map = this.getData();
    map.delete(key);
    this.saveData(map);
  }

  private getData(): Map<string, any> {
    if (!existsSync(this.filepath)) {
      return new Map();
    }

    const file = readFileSync(this.filepath, {
      encoding: "utf-8",
    });

    if (!file) {
      return new Map();
    }

    return new Map(Object.entries(JSON.parse(file)));
  }

  private saveData(data: Map<string, any>) {
    writeFileSync(this.filepath, JSON.stringify(Object.fromEntries(data)), {
      encoding: "utf-8",
    });
  }
}

const messages = new Array<Entry>();
let lastPullDate = new Date();
export const messageStorage: MessageStorage = {
  async getMessages(): Promise<Entry[]> {
    return messages;
  },
  async getLastPullDate(): Promise<Date> {
    return lastPullDate;
  },
  async saveMessages(newMessages: Entry[]): Promise<void> {
    messages.push(...newMessages);
  },
  async updateLastPullDate(date: Date): Promise<void> {
    lastPullDate = date;
  }
};


