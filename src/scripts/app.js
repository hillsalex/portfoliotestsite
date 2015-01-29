$(document).ready(function() {



    var colorsToString = {
        'rgb(146, 151, 66)':'pantone 123',
        'rgb(227,226,184)':'pantone 154',
        'rgb(145,178,196)':'pantone 666',
        'rgb(235,55,0)':'pantone 377'
    };

    var idToString = [
        '#0.72 0.0 1.43 -0.8 0.0 0.0 0.0 -0.13',
        '#0.66 0.22 1.66 0.08 -0.12 0.58 0.96',
        '#0.78 0.47 1.55 1.5 1.5 -0.6 -0.27 -0.53',
        '#0.29 0.57 -0.48 0.06 -0.06 0.18 0.0 0.0',
        '#0.73 -0.29 -1.16 -0.22 0.44 1.52 -0.67',
        '#0.66 0.44 0.11 0.18 0.04 0.36 -0.88',
        '#-0.84 1.05 -1.48 0.0 0.0 -0.0 -1.04',
        '#0.0 1.6 0.0 1.26 -1.26 0.25 0.05 0.05',
        '#-0.08 -0.05 0.18 0.16 0.41 -0.41 1.15',
        '#0.87 0.73 1.89 1.69 -0.28 -0.56 0.0',
        '#1.98 1.58 1.19 -0.34 -0.34 0.88 1.02',
        '#0.05 -0.07 -0.18 0.37 2.25 -0.75 0.49',
        '#0.0 1.14 -0.38 -0.43 -0.32 1.07 0.57',
        '#0.9 0.9 1.27 -0.09 -0.53 -0.27 0.48',
        '#-0.35 -1.77 0.0 -0.21 -0.21 0.52 -0.45',
        '#-0.31 1.26 -0.94 0.69 0.0 -1.22 0.35',
        '#-0.32 0.26 0.91 -2.0 2.0 1.0 -0.62 -0.94',
        '#0.0 0.0 -0.0 -0.8 -0.8 -1.13 0.64',
        '#0.21 0.21 1.16 0.0 0.89 -0.45 -0.0 -0.0',
        '#0.5 1.25 -1.74 0.44 0.0 -0.67 -1.53',

    ];

    var startingColorCode = "rgb(146, 151, 66)";

    var totalModels = 20;

    var startingHeight = 18;
    var minHeight = 17;
    var maxHeight = 20;


    if (isTable) {
        idToString = [
            'test1',
            'test12',
            'test13',
            'test14',
            'test15',
            'test16',
            'test17',
            'test18',
            'test19',
            'test21',
            'test22',
            'test23',
            'test24',
            'test25',
            'test26',
            'test27',
            'test28',
            'test29',
            'test20',
            'test212',

        ];

        startingColorCode = "rgb(146, 151, 66)";

        totalModels = 20;

        startingHeight = 18;
        minHeight = 17;
        maxHeight = 20;
    }





    $(".tableMainPic").bxSlider({
        pager: false
    });

    $(".bx-next").text("");
    $(".bx-prev").text("");

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

    /*
    $("#orderButton").click(function(){

      window.open('mailto:hills.jon@gmail.com?subject=[rnd] End table order&body=I used a form on rnd.com to order an end table! It\'s table '+idToString[currentModelNum]+' at a height of '+$('#colorslider').val() + " inches, using color " +currentColorCode+ ".%0D%0A%0D%0AFeel free to fill in a message here, as well as add any relevant information.");
    });
    */
    $("#threedidentifier").find("h2").text(idToString[currentModelNum]);
    $("#geometricParams").text(idToString[currentModelNum]);

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
        $("#color-description").text(colorsToString[code]);
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
        $("#height-text").text(setHeight + " inches");
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
        var rotString = "0 1 0 " + (Math.random() * 2 - 1);
        $("#yRotation").attr("rotation", rotString);


        setHeight();
    }
    var colorBlocks = $(".color-ui-block");

    function getNewModel() {
        var modelNumber = Math.floor(Math.random() * totalModels);
        currentModelNum = modelNumber;
        var modelPath = "models/tables/endTable" + modelNumber + ".x3d";
        var img0path = "url(images/tables/endTable" + modelNumber + "-0.png)";
        var img1path = "url(images/tables/endTable" + modelNumber + "-1.png)";

        if (isTable) {
            modelPath = "models/tables/endTable" + modelNumber + ".x3d";
            img0path = "url(images/tables/endTable" + modelNumber + "-0.png)";
            img1path = "url(images/tables/endTable" + modelNumber + "-1.png)";
        }

        $("#threedidentifier").find("h2").text(idToString[currentModelNum]);
        $("#geometricParams").text(idToString[currentModelNum]);
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

    randomize();
    setColors(startingColorCode);
    setInlineLoadedInterval();
});
