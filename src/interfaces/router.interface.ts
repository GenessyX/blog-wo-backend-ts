interface IRoute {
  prefix: string;
  params: Record<string, NumberConstructor | StringConstructor>;
  // params: string[] | null;
}

export type Router = Record<string, IRoute>;
