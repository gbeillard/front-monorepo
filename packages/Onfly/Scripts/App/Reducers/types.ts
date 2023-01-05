import { Environments } from "@bim-co/onfly-connect";

export type Resources = { [key: string]: { [key: string]: string } };

export type EnvironmentType = `${Environments}`;
