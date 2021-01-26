type Level = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
type DefaultMeta = {
  layer: string;
  component: string;
  fileName: string;
};
type Options = {
  environment?: string;
};
type Logger = {
  [K in Level]: (...rest: any | keyof DefaultMeta) => void; // // FIXME: 🐛.
};

export type { Level, DefaultMeta, Options, Logger };
