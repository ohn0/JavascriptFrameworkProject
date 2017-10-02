"use strict";
function Framework() {
    var collage = {};
    collage.makeCollage = function (params) {
        var newCollage = {};
        var boxArray = params.boxArray;
        var parentDIV = params.parent;
        var imageNames = params.imageNames || null;
        var rowLength = params.rowLength;
        var colLength = params.colLength;
        ;
        var boxHeight = Math.ceil(100 / colLength);
        var boxWidth = Math.floor(100 / rowLength);
        var divCount = 0;
        console.log("Parent div is called: " + parentDIV.id);
        var divList = [];
        console.log("Width of an individual box: " + boxWidth +
                "\nHeight of an individual box: " + boxHeight);
        for (var i = 0; i < colLength; i++) {
            if (boxArray[i].length !== rowLength || boxArray.length !== colLength) {
                alert("Number of rows/cols in array does not match " +
                        "number of rows/cols set as input.");
                return null;
            }
        }

        if (imageNames === null) {
            alert("No images attached.");
        }

        function makeDiv(params) {
            console.log("Making a new div!");
            var box = document.createElement("div");
            box.id = parentDIV.id + String(divCount);
            divCount++;
            box.style.height = boxHeight + "%";
            box.style.width = boxWidth + "%";
            box.style.boxSizing = "border-box";
            box.style.borderStyle = "solid";
            box.style.borderWidth = "1px";
            box.style.borderColor = "red";
            box.style.display = "inline-block";
            box.style.zIndex = 1;
            box.style.backgroundColor = "white";
            box.style.margin = "0px";
            box.style.top = params.divYlocation + "%";
            box.style.left = params.divXlocation + "%";
            box.style.width = params.width + "%";
//                        box.style.backgroundImage = "url("+imageNames[(divCount-1) % imageNames.length]+")";
            box.style.backgroundImage = "url(" + imageNames[Math.floor
                (Math.random() * imageNames.length)] + ")";
            box.style.backgroundSize = "100% 100%";
            box.style.backgroundRepeat = "no-repeat";
            parentDIV.appendChild(box);
            divList.push(String(box.id));
        }

        newCollage.makeBoxes = function () {
            var divWidth = 0;
            var Xval = 0;
            var Yval = 0;
            for (var i = 0; i < colLength; i++) {
                var currentVal = boxArray[i][0];
                divWidth = 0;
                Yval += boxHeight;
                for (var j = 0; j <= rowLength - 1; j++) {
                    divWidth += boxWidth;
                    Xval += boxWidth;
                    if (boxArray[i][j + 1] !== currentVal) {
                        makeDiv({
                            width: divWidth,
                            divXlocation: Xval,
                            divYlocation: Yval
                        });
                        currentVal = boxArray[i][j + 1];
                        divWidth = 0;
                    }
                }
            }
            return null;
        };

        newCollage.listBoxes = function () {
            for (var i = 0; i < divCount; i++) {
                console.log(divList[i]);
            }
        };

        newCollage.boxCount = function () {
            return divList.length;
        };

        newCollage.getBox = function (boxIndex) {
            if (boxIndex < divList.length) {
                return divList[boxIndex];
            }
            else {
                alert("The box that you want to access does not exist.");
            }
        };
        return newCollage;
    };
    return collage;
}