import { StorageService } from "./storage.service";

let value = 0;

const getValue = async () => {
  log("executing getvalue", { value });
  if (value === 0) {
    value++;
    throw new Error("error");
  }
  return value++;
};

export const [getValueMemoized, revalidateGetValue] = StorageService.wrap(
  getValue,
  "value",
);

export const RequestContext = new AsyncLocalStorage();

export const log = (message, ...args) => {
  console.log(`[${RequestContext.getStore()}]: ${message}`, ...args);
};
