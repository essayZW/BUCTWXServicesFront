Component({
    externalClasses: [
        'ext-class',
        'ext-ring-pointer-class',
        'ext-center-color-class',
        'ext-slider-pointer-class'
    ],
    data: {
        list: []
    },

    properties: {
        animationDuration: {
            value: 500,
            type: Number
        },
        confirmImage: {
            value: 'confirm-white.svg',
            type: String
        },
        sSliderPointerImage: {
            value: null,
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

        sliderWidthPercent: {
            value: 0.9,
            type: Number
        },

        sliderHeightPercent: {
            value: 0.2,
            type: Number
        },

        pickerWidth: {
            value: '75%',
            type: String
        },

        pickerHeight: {
            value: '80%',
            type: String
        },
        zIndex: {
            value: 999,
            type: Number
        },

        showOpacity: {
            value: true,
            type: Boolean
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

        ringPointerImage: null,

        showOpacity: {
            value: false,
            type: Boolean
        },

        showDialog: {
            value: false,
            type: Boolean
        },
        maskColor: {
            value: [0, 0, 0],
            type: Array
        },
        maskOpacity: {
            value: 0.5,
            type: Number
        }
    },

    data: {
        lock: false
    },

    methods: {
        colorConfirm(color) {
            this.triggerEvent('colorConfirm', color.detail, {});
            this.setData({
                showDialog: false
            })
        },

        lockChange(lock) {
            this.data.lock = lock.detail;
        },

        colorChange(color) {
            this.triggerEvent('colorChange', color.detail, {});
        },

        closeDialog(e) {
            if (this.data.lock) return;
            if (e.target.id != 'dialogRoot') return;
            this.setData({
                showDialog: false
            })
        },

    },

    attached: function () {
    },


    ready() {
    }
});