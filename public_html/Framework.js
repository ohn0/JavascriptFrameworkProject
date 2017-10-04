"use strict";
function my$(id) {
    return document.getElementById(id);
}

function createElement(parent){
    
}

function Framework() {
    var FW = {};
    FW.collageFW = function (params) {
        var newCollage = {};
        var boxArray = params.boxArray;
        var parentDIV = params.parent;
        var imageNames = params.imageNames || null;
        var rowLength = params.rowLength;
        var colLength = params.colLength;
        var defaultBorderValue = "black";
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
            box.style.borderColor = defaultBorderValue;
            box.style.display = "inline-block";
            box.style.zIndex = 1;
            box.style.backgroundColor = "white";
            box.style.margin = "0px";
            box.style.top = params.divYlocation + "%";
            box.style.left = params.divXlocation + "%";
            box.style.width = params.width + "%";
            box.style.backgroundImage = "url(" + imageNames[Math.floor
                (Math.random() * imageNames.length)] + ")";
            box.style.backgroundSize = "contain";
            box.style.backgroundRepeat = "no-repeat";
            box.style.backgroundPosition = "center center";
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

        newCollage.toggleBorder = function() {
            for(var i = 0; i < divCount; i++){
                if(my$(divList[i]).style.border !== "none"){
                    my$(divList[i]).style.border = "none";
                }
                else{
                    my$(divList[i]).style.border = defaultBorderValue;
                }
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
                return null;
            }
        };
        return newCollage;
    };
    
    FW.makeTextCloud = function(params){
        var newTextCloud = {};
        var splitStrings = params.strings.toLowerCase().split(" ");
        var strLength = splitStrings.length;
        var frequencyMap = new Map();
        var uniqueWords = [];

        console.log("Before normalization: " + splitStrings);

        normalizeString();
        stringFrequency();
        var textDiv = my$(params.parentDiv);

        function removePunctuation(textString){
            var modified = false;
            if(textString.includes(".")){
                modified = true;
                textString =  textString.slice(0, textString.length - 1);
            }
            if(textString.includes(",")){
                modified = true;
                textString = textString.slice(0, textString.length - 1);
                
            }
            if(textString.includes("\"")){
                modified = true;
                if(textString.charAt(0) === "\""){
                    textString = textString.slice(1, textString.length - 1);
                }
                if(textString.charAt(textString.length-1) === "\""){
                    textString = textString.slice(0, textString.length - 1);
                }
            }
            if(textString.includes("!")){
                modified = true;
                textString = textString.slice(0, textString.length - 1);
            }
            if(modified){
                return textString;
            }
            return null;
        }
        
        function normalizeString(){
            for(var i = 0; i < strLength; i++){
                splitStrings[i] = removePunctuation(splitStrings[i]) ||
                                  splitStrings[i];
            }
            console.log("After normalization:" + splitStrings);
        }
        
        newTextCloud.changeString = function(newString){
            splitStrings = newString.toLowerCase().split(" ");
            normalizeString();
        };

        function stringFrequency(){
            for(var i = 0; i < strLength; i++){
                frequencyMap.set(splitStrings[i], 0);
            }
            
            for(var i = 0; i < strLength; i++){
                if(frequencyMap.get(splitStrings[i]) === 0){
                    uniqueWords.push(splitStrings[i]);
                }
                frequencyMap.set(splitStrings[i],
                    frequencyMap.get(splitStrings[i]) + 1);
            }
            
            console.log(frequencyMap);
            return null;
        }
        
        function setSize(textSpan, textVal){
            textSpan.style.color = "rgb(0," + (16 + (2*frequencyMap.get(textVal))) + ", " 
                    + (30 * frequencyMap.get(textVal)) + ")";
            textSpan.style.fontSize = (100 * (frequencyMap.get(textVal))) + "%";
        }
        
        newTextCloud.writeText = function(params){
            var uniqueVals = [];
            for(var i = 0; i < uniqueWords.length; i++){
                uniqueVals[i] = false;
            }
            var somePrime = 523;
            for(var i = 0; i < uniqueWords.length; i++){
                var newSpan = document.createElement("span");
                //Access each array value by taking the product of the current 
                //index with a prime and then modulo the length of the array.
                //This will create a permutation of the text, OK, not a perfect
                //permuatation, the first value still won't move.
                newSpan.id = uniqueWords[(somePrime * i) % uniqueWords.length] + "SPAN";
                textDiv.appendChild(newSpan);
                setSize(newSpan, uniqueWords[(somePrime * i) % uniqueWords.length]);
                newSpan.innerHTML += (uniqueWords[(somePrime * i) % uniqueWords.length] + " ");
            }
        };
        
        return newTextCloud;
    };
    
    return FW;
}