Component({


    externalClasses: [
        'ext-ring-pointer-class',
        'ext-center-color-class',
        'ext-slider-pointer-class'
    ],

    properties: {

        maxRecentColorsNumber: {
            value: 10,
            type: Number
        },

        centerBackgroundColor: {
            value: 'white',
            type: String
        },
        showOpacity: {
            value: false,
            type: Boolean
        },

        sSliderPointerImage: {
            value: null,
            type: String
        },
        confirmImage: {
            value: 'confirm-white.svg',
            type: String
        },
        vSliderPointerImage: {
            value: null,
            type: String
        },

        tSliderPointerImage: {
            value: null,
            type: String
        },

        ringPointerImage: {
            value: null,
            type: String
        },

        sliderWidthPercent: {
            value: 0.9,
            type: Number
        },

        sliderHeightPercent: {
            value: 0.2,
            type: Number
        },

        pointerRadiusPercent: {
            value: 1.5,
            type: Number
        },

        colorRingWidthPercent: {
            value: 1,
            type: Number
        },

        sliderPointerHeightPercent: {
            value: 2,
            type: Number
        },
        sliderPointerWidthPercent: {
            value: 1,
            type: Number
        },

        centerColorRadiusPercent: {
            value: 0.3,
            type: Number
        },

        animationDuration: {
            value: 500,
            type: Number
        },
    },
    data: {
        lock: false,
        canvasReady: false,
        ssliderReady: false,
        vsliderReady: false,
        tsliderReady: false,
        currentColor: null,
        ringColors: [],
        mainCanvasBounds: {center: {}},
        ringRadius: 100,
        pointerRadius: 7,
        ringWidth: 20,
        chooseColorRadius: 30,
        pointerRadius: 0,
        ringWidthPercent: 0.1,
        extendPointerRadiusPercent: 1,

        sliderRect: {},

        canvasWidth: 0,
        canvasHeight: 0,
        showCanvas: true,
        tempRingImg: null,
        bgRadius: 0,

        commonColors: [
            {hex: '#C0C0C0'},
            {hex: '#FFFFFF'},
            {hex: '#808080'},
            {hex: '#000000'},
            {hex: '#FF0000'},
            {hex: '#800000'},
            {hex: '#FFFF00'},
            {hex: '#808000'},
            {hex: '#00FF00'},
            {hex: '#008000'},
            {hex: '#00FFFF'},
            {hex: '#008080'},
            {hex: '#0000FF'},
            {hex: '#000080'},
            {hex: '#FF00FF'},
            {hex: '#800080'},
        ],
        recentColors: []
    },

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () {
            const version = 'v1.share';
            const style = "color:red;background-color:yellow";
            console.log("%c \u262F Zasi ColorPicker (version "+version+") \u262F - Developer 老脸叔叔(Old Face Uncle) 947734830@qq.com or deaocy@yeah.net ",style);

            let that = this;
            wx.getStorage({
                key: '_zasi_recent_c0lors',
                success(res) {
                    try {
                        that.data.recentColors = JSON.parse(res.data);
                    } catch (e) {
                        console.error('解析最近使用颜色JSON出错', e);
                    }

                    let currentColor = null;

                    if (that.properties.color != null) {
                        let hex = that.properties.color.hex;
                        if (hex == null) {
                            currentColor.hex = that.properties.color;
                            currentColor.opacity = 1;
                        } else {
                            currentColor = that.properties.color;
                        }
                    } else {
                        if (that.data.recentColors != null
                            && that.data.recentColors.length != 0) {
                            currentColor = that.data.recentColors[0];
                        }
                    }

                    if (currentColor != null) {
                        try {
                            let opacity = currentColor.opacity;
                            let hex = currentColor.hex;
                            currentColor = that.hexToRgb(currentColor.hex);
                            if (currentColor != null && currentColor.length == 3) {
                                currentColor = that.rgbToHsv(currentColor[0], currentColor[1], currentColor[2]);
                                currentColor.t = opacity;
                                currentColor.hex = hex;
                            }

                        } catch (e) {
                            console.error('颜色值有错误:' + currentColor, e);
                            currentColor = null;
                        }
                    }

                    if (currentColor == null) {
                        currentColor = {h: 270, s: 1, v: 1, t: 1};
                        currentColor.hex = that.hsv2rgb(270, 1, 1).hex;
                        currentColor.opacity = 1;
                    } else {
                        if (currentColor.t == null)
                            currentColor.t = 1;
                    }
                    that.data.currentColor = currentColor;
                    that.setData({
                        recentColors: that.data.recentColors
                    });
                },
                fail(e) {
                    that.data.currentColor = {h: 270, s: 1, v: 1, t: 1};
                    that.data.currentColor.hex = that.hsv2rgb(270, 1, 1).hex;
                    that.data.currentColor.opacity = 1;
                }
            });
            this.initBounds();
        },
        ready: function () {

        },
    },


    methods: {
        insertInArrayTop(array, value) {
            if (array == 0) {
                array.push(value);
                return;
            }
            array.push(array[array.length - 1]);
            for (let i = array.length - 1; i >= 1; i--) {
                array[i] = array[i - 1];
            }
            array[0] = value;
            if (array.length > this.properties.maxRecentColorsNumber) {
                for (let i = 0; i < array.length - this.properties.maxRecentColorsNumber; i++) {
                    array.pop();
                }
            }
        },
        confirmColor(e) {
            if (this.data.lock) return;
            let that = this;
            this.insertInArrayTop(this.data.recentColors, {
                hex: this.data.currentColor.hex,
                opacity: this.data.currentColor.opacity
            });
            wx.setStorage({
                key: '_zasi_recent_c0lors',
                data: JSON.stringify(this.data.recentColors),
                success() {
                    that.triggerEvent('colorConfirm', {
                        value: that.data.currentColor.hex,
                        opacity: that.data.currentColor.opacity
                    }, {})
                },
                fail() {
                    that.triggerEvent('colorConfirm', {
                        value: that.data.currentColor.hex,
                        opacity: that.data.currentColor.opacity
                    }, {})
                }
            });
        },

        colorChange(color) {
            this.data.currentColor.hex = color.hex;
            this.data.currentColor.opacity = color.t;
            this.triggerEvent('colorChange', {value: color.hex, opacity: color.t});
        },

        lockEventTrigger() {
            this.data.lock = true;
            this.triggerEvent('lock', true);
        },

        unLockEventTrigger() {
            this.data.lock = false;
            this.triggerEvent('lock', false);
        },

        chooseColorCard(e) {
            if (this.data.lock) return;
            let color = e.currentTarget.dataset.color;
            if (color.h == null) {
                let rgb = this.hexToRgb(color.hex);
                let hsv = this.rgbToHsv(rgb[0], rgb[1], rgb[2]);
                color.h = hsv.h;
                color.s = hsv.s;
                color.v = hsv.v;
            }
            if (color.opacity == null) {
                color.opacity = 1;
            }
            color.t = color.opacity;

            this.setData({
                currentColor: color
            })

        },

        initBounds() {
            this.generateColors();
            let query = wx.createSelectorQuery().in(this);
            let that = this;
            query.select('#main-container').boundingClientRect().exec(function (res) {
                let canvasRect = that.data.mainCanvasBounds;
                that.data.mainCanvasBounds.width = res[0].width;
                that.data.mainCanvasBounds.height = res[0].height;

                that.data.mainCanvasBounds.left = res[0].left;
                that.data.mainCanvasBounds.top = res[0].top;
                let width = that.data.mainCanvasBounds.height;
                if (width > that.data.mainCanvasBounds.width) {
                    width = that.data.mainCanvasBounds.width;
                }
                //这个圆盘最大比例是1，否则将会超出整个区域
                let widthPercent = Math.min(1, that.properties.colorRingWidthPercent);
                that.data.ringRadius = width / 2 * widthPercent;
                that.data.bgRadius = that.data.ringRadius * (1 - 1.41 * 0.05);
                that.data.ringWidth = that.data.ringRadius - that.data.bgRadius;
                that.data.chooseColorRadius = that.data.ringRadius * that.properties.centerColorRadiusPercent;

                that.data.mainCanvasBounds.center.x = that.data.mainCanvasBounds.width / 2;
                that.data.mainCanvasBounds.center.y = that.data.mainCanvasBounds.height / 2;
                that.data.pointerRadius = that.data.ringWidth * that.properties.pointerRadiusPercent;
                // that.data.pointerAngle = Math.asin(that.data.pointerRadius / that.data.ringRadius) * 180 / Math.PI;
                // canvas被我彻底抛弃了 :(
                // let ctx = wx.createCanvasContext('canvas', that);
                // that.drawColorCircle(ctx, that.data.ringRadius, that.data.ringWidth, that.data.mainCanvasBounds.center);
                that.data.canvasReady = true;
                that.pickerReady();

            });

            let query2 = wx.createSelectorQuery().in(this);
            query2.select('#slider-s').boundingClientRect().exec(function (res) {
                let rect = {left: res[0].left, top: res[0].top, width: res[0].width, height: res[0].height};
                rect.right = rect.left + rect.width;
                rect.bottom = rect.top + rect.height;
                that.data.sSliderRect = rect;
                that.data.ssliderReady = true;
                let pointerHeight = rect.height * that.properties.sliderPointerHeightPercent;
                that.data.sliderPointerWidth = that.properties.sliderPointerWidthPercent * pointerHeight;
                that.data.sliderPointerHeight = pointerHeight;
                that.pickerReady();
            });

            let query3 = wx.createSelectorQuery().in(this);
            query3.select('#slider-v').boundingClientRect().exec(function (res) {
                let rect = {left: res[0].left, top: res[0].top, width: res[0].width, height: res[0].height};
                rect.right = rect.left + rect.width;
                rect.bottom = rect.top + rect.height;
                that.data.vSliderRect = rect;
                that.data.vsliderReady = true;
                that.pickerReady();
            });
            if (that.properties.showOpacity) {
                let query4 = wx.createSelectorQuery().in(this);
                query4.select('#slider-t').boundingClientRect().exec(function (res) {
                    let rect = {left: res[0].left, top: res[0].top, width: res[0].width, height: res[0].height};
                    rect.right = rect.left + rect.width;
                    rect.bottom = rect.top + rect.height;
                    that.data.tSliderRect = rect;
                    that.data.tsliderReady = true;
                    that.pickerReady();
                });
            } else {
                that.data.tsliderReady = true;
                that.data.tsliderReady = {};
                that.pickerReady();
            }


            let query5 = wx.createSelectorQuery().in(this);
            query5.select('#colorsCard').boundingClientRect(function (res) {
                let r = res;
                let h = r.height;
                let perH = h * 0.4;
                that.data.colorCardWidth = perH;
                that.setData({
                    colorCardWidth: that.data.colorCardWidth
                })
            }).exec();
        },

        pickerReady() {
            if (this.data.canvasReady && this.data.ssliderReady && this.data.vsliderReady && this.data.tsliderReady) {
                this.setData({
                    currentColor: this.data.currentColor,
                    pointerRadius: this.data.pointerRadius,
                    ringRadius: this.data.ringRadius,
                    containerRect: this.data.mainCanvasBounds,
                    chooseColorRadius: this.data.chooseColorRadius,
                    sSliderRect: this.data.sSliderRect,
                    vSliderRect: this.data.vSliderRect,
                    tSliderRect: this.data.tSliderRect,
                    sliderPointerWidth: this.data.sliderPointerWidth,
                    sliderPointerHeight: this.data.sliderPointerHeight,
                    bgRadius: this.data.bgRadius
                })
            }
        },

        /**不再使用canvas绘制
         * */
        // drawColorCircle(ctx, radius, ringWidth, center) {
        //     //1个角度一个颜色：
        //     ctx.save();
        //     ctx.lineWidth = ringWidth;
        //     ctx.translate(center.x, center.y);
        //     let fp = {x: radius, y: 0};
        //     for (let h = 0; h < 360; h++) {
        //         let c = this.data.ringColors[h];
        //         ctx.strokeStyle = c.hex;
        //
        //         let angle = Math.PI * h / 180;
        //         let angle1 = Math.PI * (h + 1) / 180;
        //         //没办法获得arc的最后一个点，自己算;或者可以利用矩阵变，不计算也行;
        //         let np = {x: radius * Math.cos(angle), y: radius * Math.sin(angle)};
        //         ctx.beginPath();
        //         ctx.moveTo(fp.x, fp.y);
        //         ctx.arc(0, 0, radius, angle, angle1);
        //         ctx.closePath();
        //         fp.x = np.x;
        //         fp.y = np.y;
        //         ctx.stroke();
        //     }
        //     ctx.restore();
        //     ctx.draw();
        // },

        generateColors() {
            this.data.ringColors = [];
            let colors = this.data.ringColors;
            for (let h = 0; h < 360; h++) {
                let rgbhex = this.hsv2rgb(h, 1, 1);
                let rgb = rgbhex.rgb;
                let color = {
                    hex: null,
                    angle: null,
                };
                color.hex = rgbhex.hex;
                color.rgb = rgb;
                color.angle = h;
                colors.push(color);
            }
            /** 下面代码保留，有用*/
            // console.log(colors[90].hex,colors[68].hex,colors[45].hex,colors[23].hex,colors[0].hex);
            // console.log(colors[90].hex,colors[112].hex,colors[135].hex,colors[157].hex,colors[180].hex);
            // console.log(colors[270].hex,colors[248].hex,colors[225].hex,colors[203].hex,colors[180].hex);
            // console.log(colors[270].hex,colors[292].hex,colors[315].hex,colors[327].hex,colors[0].hex);
        },

        componentToHex(c) {
            let hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },

        rgbToHex(r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },

        hsv2rgb(hue, saturation, value) {
            let chroma = value * saturation;
            let hue1 = hue / 60;
            let x = chroma * (1 - Math.abs((hue1 % 2) - 1));
            let r1, g1, b1;
            if (hue1 >= 0 && hue1 <= 1) {
                ([r1, g1, b1] = [chroma, x, 0]);
            } else if (hue1 >= 1 && hue1 <= 2) {
                ([r1, g1, b1] = [x, chroma, 0]);
            } else if (hue1 >= 2 && hue1 <= 3) {
                ([r1, g1, b1] = [0, chroma, x]);
            } else if (hue1 >= 3 && hue1 <= 4) {
                ([r1, g1, b1] = [0, x, chroma]);
            } else if (hue1 >= 4 && hue1 <= 5) {
                ([r1, g1, b1] = [x, 0, chroma]);
            } else if (hue1 >= 5 && hue1 <= 6) {
                ([r1, g1, b1] = [chroma, 0, x]);
            }

            let m = value - chroma;
            let [r, g, b] = [r1 + m, g1 + m, b1 + m];
            // Change r,g,b values from [0,1] to [0,255]
            let rgb = [Math.floor(255 * r), Math.floor(255 * g), Math.floor(255 * b)];
            let hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);

            return {rgb: rgb, hex: hex};
        },

        hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
        },

        rgbToHsv(r, g, b) {
            let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
            rabs = r / 255;
            gabs = g / 255;
            babs = b / 255;
            v = Math.max(rabs, gabs, babs),
                diff = v - Math.min(rabs, gabs, babs);
            diffc = c => (v - c) / 6 / diff + 1 / 2;
            percentRoundFn = num => Math.round(num * 100) / 100;
            if (diff == 0) {
                h = s = 0;
            } else {
                s = diff / v;
                rr = diffc(rabs);
                gg = diffc(gabs);
                bb = diffc(babs);

                if (rabs === v) {
                    h = bb - gg;
                } else if (gabs === v) {
                    h = (1 / 3) + rr - bb;
                } else if (babs === v) {
                    h = (2 / 3) + gg - rr;
                }
                if (h < 0) {
                    h += 1;
                } else if (h > 1) {
                    h -= 1;
                }
            }
            return {
                h: Math.round(h * 360),
                s: percentRoundFn(s),
                v: percentRoundFn(v)
            };
        }
    }
});