$(document).ready(function() {


    var idToString = 
    [
      'nzpd',
      'random1'
    ];

    var startingColorCode = "rgb(146, 151, 66)";

    var totalModels = 2;

    var startingHeight = 18;
    var minHeight = 17;
    var maxHeight = 20;

    var currentColorCode = startingColorCode;
    var currentModelNum = 0;

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


    $("#main3d-dev").on('mousewheel', function(event) {
        var baba = 0;
        baba++;
        event.preventDefault();
    });

    $(".randomizeButton").click(function() {
        randomize();
    });
    $("#orderButton").click(function(){

      window.open('mailto:hills.jon@gmail.com?subject=[rnd] End table order&body=I used a form on rnd.com to order an end table! It\'s table #'+idToString[currentModelNum]+' at a height of '+$('#colorslider').val() + " inches, using color " +currentColorCode+ ".%0D%0A%0D%0AFeel free to fill in a message here, as well as add any relevant information.");
    });

    $("#threedidentifier").find("h2").text(idToString[currentModelNum]);


    function setInlineLoadedInterval() {
        var inline = $("inline");
        var intervalID = setInterval(function() {
            if (inline.children().length == 0) return;

            clearInterval(intervalID);
            setColors(currentColorCode);
            setHeight();
            $("#front").attr("set_bind", "true");
            
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

        $("#sm-height-text").text(setHeight + " inches");
        $("#height-text").text(setHeight+" inches");
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


    function randomize() {
        var newVal = Math.floor((Math.random() * (maxHeight - minHeight)) + minHeight);
        $("#colorslider").val(newVal);

        getNewModel();


        setHeight();
    }
    var colorBlocks = $(".color-ui-block");

    function getNewModel() {
        var modelNumber = Math.floor(Math.random() * totalModels);
        currentModelNum=modelNumber;
        var modelPath = "models/tables/endTable" + modelNumber + ".x3d";
        var img0path = "url(images/tables/endTable" + modelNumber + "-0.png)";
        var img1path = "url(images/tables/endTable" + modelNumber + "-1.png)";
        
        $("#threedidentifier").find("h2").text(idToString[currentModelNum]);

        var color = Math.floor(Math.random() * colorBlocks.length);
        colorBlocks.removeClass("selected");
        var code = $(colorBlocks[color]).attr("data-ui-color-code");
        $(colorBlocks[color]).addClass("selected");
        currentColorCode = code;
        setColors(code);

        $("inline").empty();

        $("inline").attr("url", modelPath);
        $(".smallImage1").css("background-image", img0path);
        $(".smallImage2").css("background-image", img1path);
        setInlineLoadedInterval();
    }


    setColors(startingColorCode);
    setInlineLoadedInterval();
});
