$(document).ready(function() {
    $(".color-ui-block").each(function(a, b) {
        makeUIClick($(b));
    });

    function makeUIClick(elt) {
        elt.click(function(a, b) {
            var clicked = $(a.target);
            if (clicked.hasClass("selected")) return;

            ($('.color-ui-block').removeClass('selected'));
            clicked.addClass('selected');

            var code = clicked.attr("data-ui-color-code");
            $("[data-ui-color-change]").each(function(x, toChange) {
                toChange = $(toChange);
                toChange.css(toChange.attr("data-ui-color-change"), code);
            });
            var pieces = splitColorCode(code);
            changeModelMaterial(Number(pieces[0])/255,Number(pieces[1])/255,Number(pieces[2])/255);
            /*
            tableObj.material.color = new THREE.Color(code);*/
            runFilterOnImage("bigImageCanvas", bigImage, function(px) {

                return Filters.changeColor(px, code);
            });
            runFilterOnImage("smImageCanvas1", smImage1, function(px) {
                return Filters.changeColor(px, code);
            });
            runFilterOnImage("smImageCanvas2", smImage2, function(px) {
                return Filters.changeColor(px, code);
            });
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





    M_PI = 3.141592;

    Filters = {};
    Filters.getPixels = function(img) {
        var c = this.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height);
    };

    Filters.getCanvas = function(w, h) {
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
    };
    Filters.filterImage = function(filter, image, var_args) {
        var args = [this.getPixels(image)];
        for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        return filter.apply(null, args);
    };

    Filters.changeColor = function(pixels, code) {
        var d = pixels.data;
        var cs = code.split(',');
        cs[0] = cs[0].split('(')[1];
        cs[2] = cs[2].split(')')[0];
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            if (r != 255 && g != 255 && b != 255) {
                d[i] = cs[0];
                d[i + 1] = cs[1];
                d[i + 2] = cs[2];
            } else {
                d[i + 3] = 0;
            }
        }
        return pixels;
    }

    Filters.tmpCanvas = document.createElement('canvas');
    Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');
    Filters.createImageData = function(w, h) {
        return this.tmpCtx.createImageData(w, h);
    };


    function runFilterOnImage(canvasId, image, filter, arg1, arg2, arg3) {
        var c = document.getElementById(canvasId);
        var s = c.previousSibling.style;
        //var b = c.parentNode.getElementsByTagName('button')[0];
        //if (b.originalText == null) {
        //  b.originalText = b.textContent;
        //}
        var idata = Filters.filterImage(filter, image, arg1, arg2, arg3);
        c.width = idata.width;
        c.height = idata.height;
        var ctx = c.getContext('2d');
        ctx.putImageData(idata, 0, 0);
        //b.textContent = 'Restore original image';
    }

    var bigImage = new Image();
    var smImage1 = new Image();
    var smImage2 = new Image();
    bigImage.src = $(".large-dims > img").attr('src');
    smImage1.src = $(".sm-dims > img:first").attr('src');
    smImage2.src = $(".sm-dims > img:last").attr('src');

    bigImage.onload = function() {
        smImage1.onload = function() {
            smImage2.onload = function() {

                var clicked = $($(".color-ui-block")[0]);


                var code = clicked.attr("data-ui-color-code");
                $("[data-ui-color-change]").each(function(x, toChange) {
                    toChange = $(toChange);
                    toChange.css(toChange.attr("data-ui-color-change"), code);
                });

                runFilterOnImage("bigImageCanvas", bigImage, function(px) {
                    return Filters.changeColor(px, code);
                });
                runFilterOnImage("smImageCanvas1", smImage1, function(px) {
                    return Filters.changeColor(px, code);
                });
                runFilterOnImage("smImageCanvas2", smImage2, function(px) {
                    return Filters.changeColor(px, code);
                });
            };
        };
    };

    function initx3d(){
      var c = $("#canvas3d");
            var w = c.outerWidth(true);
            var h = c.outerHeight(true);

    }

    function changeModelMaterial(r,g,b){
      var materials = getCurrentModelMaterials();
      for (var i=0;i<materials.length;i++){
        materials[i].setAttribute("diffuseColor",r + " " + g + " " + b);
      }
    }

    function getCurrentModelMaterials(){
      return $("#main3d").find("material");
    }

    function splitColorCode(code){
      var insideParens = code.split("(")[1].split(")")[0];
        return insideParens.split(",");
    }

/*
    function initthreejs() {
        var scene, camera, renderer, controls;
        var geometry, material, mesh;

        init();
        animate();

        function init() {

            scene = new THREE.Scene();
            var c = $("#canvas3d");
            var w = c.outerWidth(true);
            var h = c.outerHeight(true);
            camera = new THREE.PerspectiveCamera(75, w / h, 1, 10000);
            camera.position.z = 50;


            controls = new THREE.OrbitControls(camera);
            controls.damping = 0.2;
            controls.addEventListener('change', animate);

            geometry = new THREE.BoxGeometry(200, 200, 200);
            material = new THREE.MeshLambertMaterial({
                color: new THREE.Color("rgb(146, 151, 66)"),
                overdraw: 0.5,
                //side: THREE.DoubleSide,
            });
            mesh = new THREE.Mesh(geometry, material);
            //scene.add(mesh);

            var ambient = new THREE.AmbientLight(0x101030);
            scene.add(ambient);
            var directionalLight = new THREE.DirectionalLight(0xffeedd);
            directionalLight.position.set(0, 100, 100);
            scene.add(directionalLight);

            var manager = new THREE.LoadingManager();
            manager.onProgress = function(item, loaded, total) {

            }
            var loader = new THREE.OBJLoader(manager);
            loader.load('models/test3.obj', function(object) {
                object.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                        mesh = child;
                        tableObj = mesh;
                    }
                });
                //object.position.x = 10;
                object.position.z = -2;
                object.position.y = -3;
                object.rotation.x=5.5;
                scene.add(object);
            });


            //renderer = new THREE.CanvasRenderer({
            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById("canvas3d"),
                alpha: true
            });

            renderer.setSize(w, h);

            //document.body.appendChild(renderer.domElement);

        }

        function animate() {

            requestAnimationFrame(animate);

            //mesh.rotation.x += 0.2;
            //mesh.rotation.y += 0.2;

            renderer.render(scene, camera);

        }

    }
    initthreejs();*/
    var tableObj;
});

var viewer;
