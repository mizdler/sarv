function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

var h_range = {high: 400, low: 0};
var tolerance = 40;
var current_value = h_range['low'];
var path = "frame_sets/";
var set = 1;
var prefix = "";
var zero_pad = 4;
var format = "jpg";
var ratio = 1;
var from = 1;
var to = 10;
var fps = 1;
var update_rate = 4000;
var server = "http://localhost:3000/"

var refereshing = false;
$.elementReady(".pot", function() {
    
    setupPot = function (options) {
        path = options['path'] || "frame_sets/";
        set = options['set'] || 1;
        prefix = options['prefix'] || "";
        zero_pad = options['pad'] || 4;
        format = options['format'] || "jpg";
        ratio = options['ratio'] || 1;
        from = options['from'] || 1;
        to = options['to'] || 10;
        fps = options['fps'] || 2;
        update_rate
        
        h_range['high'] = options['high'] || 400;
        h_range['low'] = options['low'] || 0;
        
        (to == from) ? ++to : to;
        (ratio == 0) ? ratio = 1 : ratio;
        
        tolerance = (h_range['high'] - h_range['low'])/((to - from)/Math.abs(ratio));
        tolerance = Math.abs(tolerance);
        
        set_path = path+set.toString()+"/";
        file_pre_path = set_path+prefix;
        
        if (from > to && ratio > 0) {
            ratio *= -1;
        }
        
        $(".pot").empty();
        position = 0;
        for (i = from; i != to ; i += ratio) {
            file_number = pad(i.toString(), zero_pad);
            $(".pot").append($("<img>", {id: position.toString(), src: file_pre_path+file_number+"."+format, class: 'pot-frame'}));
            ++position;
        }
        $(".pot-frame#0").addClass('visible')
    }
    
    animatePlant = function() {
        if(!refereshing) {
            refereshing = true;
            var period = 1/fps*1000;
            (function animate() {
                setTimeout(function () {
                    target = $(".pot-frame.target").attr('id');
                    curr = $(".pot-frame.visible");
                    curr_index = parseInt(curr.attr('id'));
                    step = 1;
                    if (target < curr_index) {
                        step = -1;
                    }                    
                    if (target != curr_index) {
                        curr_index = curr_index + step;
                        $(".pot-frame#"+curr_index.toString()).addClass('visible');
                        $(".pot-frame#"+(curr_index - step).toString()).removeClass('visible');
                        animate();
                    }
                    else {
                        
                        refereshing = false;
                    }
              }, period);
            })();
        }
    }
    
    
    updateHumidityIndex = function() {
        $.getJSON(server, function(data){
            console.log(data['value']);
            val = data["value"];
            val > h_range['high'] ? val = h_range['high'] : val;
            val < h_range['low'] ? val = h_range['low'] : val;
            nix = Math.round((val-h_range['low'])/tolerance);
            $('#circle').circleProgress({animationStartValue: current_value, value: val/h_range['high']});
            current_value = val/h_range['high'];
            $(".pot-frame.target").removeClass('target');
            $(".pot-frame#"+nix.toString()).addClass('target');
        });           
    }
    
    
    // setupPot({set: 1, prefix: '2774849 ', pad: 3, from: 550, to: 50, fps:50})
//    setupPot({set: 3, prefix: 'fl1-', pad: 8, from: 310, to: 420, fps:24})
//    setupPot({set: 2, prefix: '2774849 ', pad: 3, from: 550, to: 50, ratio: 20, fps:2})
//    setupPot({set: 3, prefix: 'fl1-', pad: 8, from: 444, to: 558, fps:24})
    setupPot({set: 3, prefix: 'fl1-', pad: 8, from: 580, to: 723, fps:24})
//    setupPot({set: 3, prefix: 'fl1-', pad: 8, from: 1488, to: 1604, fps:24})
//    setupPot({set: 3, prefix: 'fl1-', pad: 8, from: 2461, to: 2540, fps:24})
    setInterval(updateHumidityIndex, update_rate);
    setInterval(animatePlant, 1000);
    
//    setupPot({
//        prefix: '656683 ', 
//        pad: 3, 
//        from: 0, 
//        to: 300, 
//        fps:20
//    });
    
});
