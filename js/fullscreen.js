
// import screenfull from 'screenfull';

this.pdfRef = React.createRef();


escFunction = () => {
    const { screenfullState } = this.state;
    this.setState({
        screenfullState: !screenfullState
    });
};

evFunllScreen = () => {
    if (screenfull.isEnabled) {
        screenfull.toggle(this.pdfRef.current);
    }
};


useEffect(() => {
  // 监听退出全屏事件 --- chrome 用 esc 退出全屏并不会触发 keyup 事件
  document.addEventListener("webkitfullscreenchange", escFunction); /* Chrome, Safari and Opera */
  document.addEventListener("mozfullscreenchange", escFunction); /* Firefox */
  document.addEventListener("fullscreenchange", escFunction); /* Standard syntax */
  document.addEventListener("msfullscreenchange", escFunction); /* IE / Edge */
  return () => {
  //销毁时清除监听
    document.removeEventListener("webkitfullscreenchange", escFunction);
    document.removeEventListener("mozfullscreenchange", escFunction);
    document.removeEventListener("fullscreenchange", escFunction);
    document.removeEventListener("MSFullscreenChange", escFunction);
  }
}, []);
