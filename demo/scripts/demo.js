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
var refereshing = false;
var server = "http://localhost:3000/"

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
    
    animatePlant = function(nix) {
        next_index = nix;
        var period = 1/fps*1000;
        curr = $(".pot-frame.visible");
        if(!refereshing) {
            curr_index = parseInt(curr.attr('id'));
            refereshing = true;
            (function animate(curr_index) {
                setTimeout(function () {
                    
                    step = 1;
                    if (next_index < curr_index) {
                        step = -1;
                    }
                    
                    
                    curr_index = curr_index + step;
                    $(".pot-frame#"+curr_index.toString()).addClass('visible');
                    $(".pot-frame#"+(curr_index - step).toString()).removeClass('visible');
                    if (next_index != curr_index) {
                        
                        animate(curr_index);
                    }
                    else {
                        refereshing = false;
                    }
              }, period);
            })(curr_index);
        }
    }
    
    
    updateHumidityIndex = function() {
        $.getJSON(server, function(data){
            console.log(data['value']);
            val = data["value"];
            val > h_range['high'] ? val = h_range['high'] : val;
            val < h_range['low'] ? val = h_range['low'] : val;
            nix = Math.round((val-h_range['low'])/tolerance);
            if(!refereshing) {
                animatePlant(nix);
            }
            else {
                setTimeout(function () {
                    if(!refereshing) {
                        animatePlant(nix);
                    }
                }, update_rate/4);
            }
        });
        
        
    }
    
    
    setupPot({set: 1, prefix: '2774849 ', pad: 3, from: 550, to: 50, fps:50})
//    setupPot({set: 2, prefix: '2774849 ', pad: 3, from: 550, to: 50, ratio: 20, fps:2})
    setInterval(updateHumidityIndex, update_rate);
    
//    setupPot({
//        prefix: '656683 ', 
//        pad: 3, 
//        from: 0, 
//        to: 300, 
//        fps:20
//    });
    
});
