// 打字机队列
export type Timeout = ReturnType<typeof setTimeout>;

class Typewriter {
  private queue: string[] = [];
  public consuming = false;
  private timer: Timeout | null = null;
  constructor(private onConsume: (str: string) => void) {}
  // 输出速度动态控制
  dynamicSpeed() {
    const speed = 2000 / this.queue.length;
    if (speed > 200) {
      return 200;
    } else {
      return speed;
    }
  }
  // 添加字符串到队列
  add(str: string) {
    this.queue.push(...str.split(''));
  }
  // 消费
  consume() {
    if (this.queue.length > 0) {
      const str = this.queue.shift();
      this.onConsume(str || '');
    }
  }
  // 消费下一个
  next() {
    this.consume();
    // 根据队列中字符的数量来设置消耗每一帧的速度，用定时器消耗
    this.timer = setTimeout(() => {
      this.consume();
      if (this.consuming) {
        this.next();
      }
    }, this.dynamicSpeed());
  }
  // 开始消费队列
  start() {
    this.consuming = true;
    this.next();
  }
  // 结束消费队列
  done() {
    this.consuming = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 把queue中剩下的字符一次性消费
    this.onConsume(this.queue.join(''));
    this.queue = [];
  }
}

export default Typewriter;
