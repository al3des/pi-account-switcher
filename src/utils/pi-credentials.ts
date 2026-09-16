import type { Credential } from "@earendil-works/pi-ai";
import type { ModelRegistry } from "@earendil-works/pi-coding-agent";

type LegacyAuthStorage = {
  has?(provider: string): boolean;
  get?(provider: string): Credential | undefined;
  set(provider: string, entry: Credential): void;
  remove?(provider: string): void;
  reload?(): void;
  setRuntimeApiKey?(provider: string, apiKey: string): void;
  removeRuntimeApiKey?(provider: string): void;
};

type RuntimeCredentialStore = {
  read?(provider: string): Promise<Credential | undefined>;
  modify?(provider: string, update: () => Promise<Credential | undefined>): Promise<Credential | undefined>;
  delete?(provider: string): Promise<void>;
};

type CompatibleModelRuntime = {
  credentials?: RuntimeCredentialStore;
  refresh?(): Promise<unknown>;
  setRuntimeApiKey?(provider: string, apiKey: string): Promise<void>;
  removeRuntimeApiKey?(provider: string): Promise<void>;
};

type CompatibleModelRegistry = {
  authStorage?: LegacyAuthStorage;
  /**
   * Private Pi 0.85 ModelRegistry boundary.
   *
   * Pi exposes public request/auth helpers on ModelRegistry, but not an extension API
   * for mutating persisted OAuth credentials. Keep direct runtime access isolated in
   * this file so the rest of the extension does not depend on private internals.
   */
  runtime?: CompatibleModelRuntime;
};

export type StoredCredentialSnapshot =
  | { hadCredential: true; credential: Credential }
  | { hadCredential: false; credential?: undefined };

export const piCredentialUtil = {
  async setStoredCredential(
    modelRegistry: ModelRegistry | undefined,
    provider: string,
    credential: Credential,
  ): Promise<void> {
    if (!modelRegistry) return;
    const compatible = modelRegistry as unknown as CompatibleModelRegistry;

    // Pi <=0.74 exposed AuthStorage directly on ModelRegistry.
    if (compatible.authStorage) {
      compatible.authStorage.set(provider, credential);
      compatible.authStorage.reload?.();
      return;
    }

    const runtime = compatible.runtime;
    if (runtime?.credentials?.modify) {
      await runtime.credentials.modify(provider, async () => credential);
      await runtime.refresh?.();
      return;
    }

    throw new Error("This Pi version does not expose a compatible credential store");
  },

  async snapshotStoredCredential(modelRegistry: ModelRegistry, provider: string): Promise<StoredCredentialSnapshot> {
    const compatible = modelRegistry as unknown as CompatibleModelRegistry;

    if (compatible.authStorage?.get) {
      const credential = compatible.authStorage.get(provider);
      return compatible.authStorage.has?.(provider) || credential
        ? { hadCredential: true, credential: credential as Credential }
        : { hadCredential: false };
    }

    const credential = await compatible.runtime?.credentials?.read?.(provider);
    return credential ? { hadCredential: true, credential } : { hadCredential: false };
  },

  async removeStoredCredential(modelRegistry: ModelRegistry, provider: string): Promise<void> {
    const compatible = modelRegistry as unknown as CompatibleModelRegistry;

    if (compatible.authStorage?.remove) {
      compatible.authStorage.remove(provider);
      compatible.authStorage.reload?.();
      return;
    }

    const runtime = compatible.runtime;
    if (runtime?.credentials?.delete) {
      await runtime.credentials.delete(provider);
      await runtime.refresh?.();
      return;
    }

    throw new Error("This Pi version does not expose a compatible credential store");
  },

  async setRuntimeApiKey(modelRegistry: ModelRegistry | undefined, provider: string, apiKey: string): Promise<void> {
    if (!modelRegistry) return;
    const compatible = modelRegistry as unknown as CompatibleModelRegistry;

    if (compatible.authStorage?.setRuntimeApiKey) {
      compatible.authStorage.setRuntimeApiKey(provider, apiKey);
      return;
    }

    const setRuntimeApiKey = compatible.runtime?.setRuntimeApiKey;
    if (setRuntimeApiKey) {
      await setRuntimeApiKey.call(compatible.runtime, provider, apiKey);
      return;
    }

    throw new Error("This Pi version does not expose runtime API-key overrides");
  },

  async removeRuntimeApiKey(modelRegistry: ModelRegistry | undefined, provider: string): Promise<void> {
    if (!modelRegistry) return;
    const compatible = modelRegistry as unknown as CompatibleModelRegistry;

    if (compatible.authStorage?.removeRuntimeApiKey) {
      compatible.authStorage.removeRuntimeApiKey(provider);
      return;
    }

    const removeRuntimeApiKey = compatible.runtime?.removeRuntimeApiKey;
    if (removeRuntimeApiKey) {
      await removeRuntimeApiKey.call(compatible.runtime, provider);
    }
  },
};
