import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";

const eventTypeMap = new Map<AwsApiServiceEventTypeName, {icon: string, color: string}>([
  ["residual",  {icon: "mdi-trash-can-outline", color: "grey-darken-4"}],
  ["organic",   {icon: "mdi-carrot", color: "brown"}],
  ["recycle",   {icon: "mdi-recycle", color: "yellow-accent-2"}],
  ["paper",     {icon: "mdi-newspaper-variant-outline", color: "green-accent-4"}]
]);

export default eventTypeMap