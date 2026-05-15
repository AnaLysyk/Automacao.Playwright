import fs from 'fs';
import path from 'path';

export function arquivoExiste(caminho: string): boolean {
  return Boolean(caminho) && fs.existsSync(path.resolve(caminho));
}

export function caminhoAbsoluto(caminho: string): string {
  return path.resolve(caminho);
}
