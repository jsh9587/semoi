// 간단한 동시 실행 제한 유틸 (p-limit 대체)
function pLimit(concurrency) {
  let activeCount = 0;
  const queue = [];

  const next = () => {
    if (queue.length === 0 || activeCount >= concurrency) return;
    activeCount++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve).catch(reject).finally(() => {
      activeCount--;
      next();
    });
  };

  return (fn) => {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
  };
}

module.exports = pLimit;
