export default {
    prefix: 'v'
};

var vm = new TinyVue({
     data: {
        name: 'xiaofu',
        info: {
            height: 170
        }
     },
     watch: {
        name: function (newValue, oldValue) {
            console.log(newValue); 
        },
        info: function (info, oldInfo) {
            console.log(info);
        },
        'info.height': function (height, oldHeight) {
            console.log(height);
        }
     },
     ready () {
        this.name = 'xiaoyang';
        this.info.height = 180;
     }
});
