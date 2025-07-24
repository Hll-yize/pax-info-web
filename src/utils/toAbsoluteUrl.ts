export function toAbsoluteUrl(path: string): string {
  const baseUrl = 'https://info.paxsz.com';

  // 把所有反斜杠替换成斜杠
  const normalizedPath = path.replace(/\\/g, '/');

  // 确保路径以 / 开头（如果没以 / 开头则加上）
  const fixedPath = normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath;

  return baseUrl + fixedPath;
}
