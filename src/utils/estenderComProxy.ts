import { PrismaClient } from '@prisma/client';

type ExtensionArgs = Parameters<PrismaClient['$extends']>[0];

export function estenderComProxy<T extends PrismaClient>(
  instanciaBase: T,
  extensao: ExtensionArgs
): T {
  const instanciaEstendida = instanciaBase.$extends(extensao);

  const proxy = new Proxy(instanciaBase, {
    get(target, prop, receiver) {
      // Prioriza métodos da subclasse
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      // Busca na instância estendida
      return Reflect.get(instanciaEstendida as any, prop, receiver);
    },
    has(target, prop) {
      return prop in target || prop in (instanciaEstendida as any);
    },
  });

  return proxy as T;
}
