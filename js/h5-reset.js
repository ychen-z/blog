(function () {
    function _setRootSize() {
        // a、获取根元素
        let rootHTML = document.documentElement;
        let rootFontSize;
        // b、获取当前设备宽度
        let deviceWidth = rootHTML.getBoundingClientRect().width || rootHTML.clientWidth;
        // c、设置当前设备宽度最大值为750px
        deviceWidth = deviceWidth > 750 ? 750 : deviceWidth;
        // d、当前设备宽度 / 7.5，得到“当前设备1rem所对应的字体大小”（假设设计图1rem = 100px，则有750px / 100rem = 7.5）
        rootFontSize = deviceWidth / 7.5;
        // e、设置根节点字体大小
        rootHTML.style.fontSize = rootFontSize + 'px';
    }
    _setRootSize();
    if (document.body) {
        _setRootSize();
    } else if (document) {
        document.addEventListener('DOMContentLoaded', _setRootSize);
    }
    window.addEventListener('resize', _setRootSize);
})();
