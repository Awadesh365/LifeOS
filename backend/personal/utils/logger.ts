type LogMeta = Record<string, unknown>;

const formatMeta = (meta?: LogMeta) => {
  if (!meta || Object.keys(meta).length === 0) return '';
  return ` ${JSON.stringify(meta)}`;
};

const logger = {
  info(meta: LogMeta | string, message?: string) {
    if (typeof meta === 'string') {
      console.log(meta);
      return;
    }
    console.log(`${message || 'info'}${formatMeta(meta)}`);
  },
  error(meta: LogMeta | string, message?: string) {
    if (typeof meta === 'string') {
      console.error(meta);
      return;
    }
    console.error(`${message || 'error'}${formatMeta(meta)}`);
  },
};

export default logger;
