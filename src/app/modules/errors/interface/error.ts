export type TErrorSrc = {
  path: string | number;
  message: string;
}[];
export let errorSources: TErrorSrc = [
  {
    path: "",
    message: "something went wrong",
  },
];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSrc;
};
