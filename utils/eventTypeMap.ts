import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";
import { 
  mdiTrashCanOutline,
  mdiCarrot,
  mdiRecycle,
  mdiNewspaperVariantOutline
} from "@mdi/js";

const eventTypeMap = new Map<AwsApiServiceEventTypeName, {icon: string, color: string}>([
  ["residual",  {icon: mdiTrashCanOutline,          color: "grey-darken-4"}],
  ["organic",   {icon: mdiCarrot,                   color: "brown"}],
  ["recycle",   {icon: mdiRecycle,                  color: "yellow-accent-2"}],
  ["paper",     {icon: mdiNewspaperVariantOutline,  color: "green-accent-4"}]
]);

export default eventTypeMap