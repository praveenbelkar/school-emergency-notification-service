import { World } from "@cucumber/cucumber";
import Spec from "pactum/src/models/Spec.js";

export type AppWorld = InstanceType<typeof World> & {
  parameters: {
    apiUrl: string;
  };
} & {
  spec: Spec;
};
