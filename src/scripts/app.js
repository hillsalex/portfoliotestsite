$(document).ready(function() {

    var startingColorCode = "rgb(146, 151, 66)";



    var startingHeight = 14;
    var minHeight = 12;
    var maxHeight = 18;

    var currentColorCode = startingColorCode;

    var menu = $(".menuHolder");
    $(".menuHolder").css('width', window.innerWidth + 'px');
    window.onresize = function() {
        $(".menuHolder").css('width', window.innerWidth + 'px');
    }

    $("#colorslider").noUiSlider({
        start: startingHeight,
        orientation: "horizontal",
        range: {
            min: minHeight,
            max: maxHeight
        },
        step: 1,
        format: wNumb({
            decimals: 0
        })
    });


    $("#colorslider").on('slide', setHeight);

    $(".noUi-handle").attr("data-ui-color-change", "background-color");
    $(".noUi-handle").addClass("no-before").addClass("no-after");

    $("#menuButton").click(function() {
        if (menu.css("display") === "none") {
            menu.show();
        } else {
            menu.hide();
        }
    });

    $(".color-ui-block").each(function(a, b) {
        makeUIClick($(b));
    });

    $("#front").attr("set_bind", "true");


    $("#main3d-dev").on('mousewheel', function(event) {
        var baba = 0;
        baba++;
        event.preventDefault();
    });



    function setInlineLoadedInterval() {
        var inline = $("inline");
        var intervalID = setInterval(function() {
            if (inline.children().length==0) return;

            clearInterval(intervalID);
            setColors(currentColorCode);

        }, 10);
    }

    function setColors(code) {
        $("[data-ui-color-change]").each(function(x, toChange) {
            toChange = $(toChange);
            toChange.css(toChange.attr("data-ui-color-change"), code);
        });
        var pieces = splitColorCode(code);
        changeModelMaterial(Number(pieces[0]) / 255, Number(pieces[1]) / 255, Number(pieces[2]) / 255);
        $(".noUi-handle").css("background-color", code);
        $(".noUi-target").css("background-color", code);

    }

    function makeUIClick(elt) {
        elt.click(function(a, b) {
            var clicked = $(a.target);
            if (clicked.hasClass("selected")) return;

            ($('.color-ui-block').removeClass('selected'));
            clicked.addClass('selected');

            var code = clicked.attr("data-ui-color-code");
            currentColorCode = code;
            setColors(code);
        });
    }


    var rightArrow = $(".right-arrow");
    var leftArrow = $(".left-arrow");
    var slider = $(".imageSlider");
    rightArrow.click(function() {
        var lval = $($(".slider-item")[0]).outerWidth(true);
        slider.animate({
            'left': "-=" + lval
        }, {
            duration: 300,
            easing: 'swing'
        });
    });

    leftArrow.click(function() {

        var lval = $($(".slider-item")[0]).outerWidth(true);
        slider.animate({
            'left': "+=" + lval
        }, {
            duration: 300,
            easing: 'swing'
        });
    });


    function setHeight() {
        var setHeight = $("#colorslider").val();
        var heightRatio = setHeight / startingHeight;
        var transform = $("#verticalScale");
        transform.attr("scale", "1 " + heightRatio + " 1");
        var smImage = $(".smallImage1");
        var widthRatio = 1 / heightRatio;
        smImage.css("background-size", (50 * widthRatio) + "% 100%");
        smImage.css("left", (50 - 50 * widthRatio) + "%");
    }


    M_PI = 3.141592;


    function changeModelMaterial(r, g, b) {
        var materials = getCurrentModelMaterials();
        for (var i = 0; i < materials.length; i++) {
            materials[i].setAttribute("diffuseColor", r + " " + g + " " + b);
        }
    }

    function getCurrentModelMaterials() {
        return $("#main3d-dev").find("material");
    }

    function splitColorCode(code) {
        var insideParens = code.split("(")[1].split(")")[0];
        return insideParens.split(",");
    }

    setColors(startingColorCode);
    setInlineLoadedInterval();
});
