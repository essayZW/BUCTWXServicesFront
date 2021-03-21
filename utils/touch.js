class touch {
  // 是否结束标记
  endFlag = false;
  // 左滑的回调函数
  leftTouchCallBack = undefined;
  // 右滑的回调函数
  rightTouchCallBack = undefined;
  constructor(left, right, limit = 1000, distance = 40) {
    this.leftTouchCallBack = left;
    this.rightTouchCallBack = right;
    this.limit = limit;
    this.distance = distance;
  }
  start(e) {
    this.startTime = new Date().getTime();
    this.startX = e.touches[0].pageX;
    this.endFlag = false;
  }

  move(e) {
    if (this.endFlag) return;
    let nowTime = new Date().getTime();
    let nowX = e.touches[0].pageX;
    if (nowTime - this.startTime > this.limit) {
      return;
    }
    // 右滑
    if (nowX - this.startX >= this.distance) {
      console.log('left');
      this.endFlag = true;
      this.rightTouchCallBack();
    }
    // 左滑
    else if (nowX - this.startX <= -this.distance) {
      console.log('right');
      this.endFlag = true;
      this.leftTouchCallBack();
    }
  }
}
module.exports = touch;
