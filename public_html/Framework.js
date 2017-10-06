"use strict";
function my$(id) {
    return document.getElementById(id);
}

function Framework() {
    var FW = {};
    FW.collageFW = function (params) {
        //Returns a collection of divs that have images in them like
        //a collage. The user will specify a 2D array of 1s and 0s
        //as the collage diagram.
        //Each row of the 2D array will correspond to a row in the collage.
        //Specifying a group of 1s/0s will indicate the width of the div.
        //The number of 1/0 groups will be the number of divs on that row.
        //The size of each row is the width of the parent div.
        //Example: A collage of 3 rows and 3 columns:
        //                  [[0,0,1,1,0],
        //                   [0,1,1,1,0],
        //                   [1,1,1,1,1]]
        //The first row will have 3 divs (00, 11, 0)
        //The second row will also ahve 3 divs (0, 111, 0)
        //The final row will have one wide div.
        //Rows and colums don't have to be the same. 
        //This will also work:
        //                  [[0,0],
        //                   [1,0],
        //                   [0,0]]
        //Each created div will also have an ID starting at 0 at the top left
        //and increasing for each div to the right followed by each row.
        //The indices of the top div will be:
        //                   [[0],
        //                   [1,2],
        //                   [3]]
        //These indices will be used to access each div individually.
        
        //Set default values
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
        
        //Ensure the 2D array matches the dimensions the user specified..
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
        
        //Creates a div and adds it to the parent.
        //Does a lot of styling.
        //
        function makeDiv(params) {
            console.log("Making a new div!");
            var box = document.createElement("div");
            var imageFile = imageNames[Math.floor(Math.random() * 
                                                imageNames.length)];
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
            box.style.backgroundImage = "url(" + imageFile + ")";
            box.style.backgroundSize = "contain";
            box.style.backgroundRepeat = "no-repeat";
            box.style.backgroundPosition = "center center";
            parentDIV.appendChild(box);
            divList.push(String(box.id));
        }

        //Associate the callback method to each of the children.
        //If no callback specified by the user, set a default.
        //
        function setCallBacks(){
            var children = parentDIV.childNodes;
            for(var i = 0; i < children.length; i++){
                children[i].onclick = params.callBack || 
                    function(){alert("Default callback");};
            }   
        }


        //Figure out the widths and starting (X,Y) coordinates of each of the
        //children. Once these values are found, call makeDiv with the found
        //values.
        //
        function makeBoxes(){
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
        }
        
        //List box names.
        newCollage.listBoxes = function () {
            for (var i = 0; i < divCount; i++) {
                console.log(divList[i]);
            }
        };

        //Turn the border on/off
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

        //Returns the box that the user wants based on the index. This 
        //will let the user style/edit each div however they want.
        newCollage.getBox = function (boxIndex) {
            if (boxIndex < divList.length) {
                return divList[boxIndex];
            }
            else {
                alert("The box that you want to access does not exist.");
                return null;
            }
        };
        
        makeBoxes();
        setCallBacks();
        return newCollage;
    };
    
    FW.makeTextCloud = function(params){
        //Creates a text cloud based on the string the user will specify.
        //The string will first be converted to lowercase and have any common
        //punctuation removed. The string will then be tokenized and each
        //occurrence of each word will be recorded.
        //The div will hold a collection of spans for each word(repeats removed).
        //Each word's font size will be proportional to the number of times that
        //word showed up in the string.
        //
        
        //Initialize default values
        var newTextCloud = {};
        var splitStrings = params.strings.toLowerCase().split(" ");
        var strLength = splitStrings.length;
        var frequencyMap = new Map();
        var uniqueWords = [];
        var constantMultiplier = 200;
        console.log("Before normalization: " + splitStrings);

        //Remove punctuation from the string and store the occurrences of
        //each word in a map.
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
        
        newTextCloud.setConstantMultipler = function(val){
            constantMultiplier = val;
        };
        
        function normalizeString(){
            for(var i = 0; i < strLength; i++){
                splitStrings[i] = removePunctuation(splitStrings[i]) ||
                                  splitStrings[i];
            }
            console.log("After normalization:" + splitStrings);
        }
        
        //Change the string.
        newTextCloud.changeString = function(newString){
            splitStrings = newString.toLowerCase().split(" ");
            normalizeString();
        };

        //Find the number of occurrences of each word in the string.
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
        
        //Sets the size of the span's contents. Use the log so that the words don't
        //get ridiculously big.
        function setSize(textSpan, textVal){
            textSpan.style.color = "rgb(0," + (16 + (2*frequencyMap.get(textVal))) + ", " 
                    + (30 * frequencyMap.get(textVal)) + ")";
            textSpan.style.fontSize = (constantMultiplier* (1+Math.log(frequencyMap.get(textVal)))) + "%";
        }
        
        newTextCloud.writeText = function(params){
            //Write each word to a separate span so that the fontsize can vary
            //between the words. Displays a permutation of the text to make
            //the text cloud look more random. 
            //The permutation is created by looping for the length of string
            //and multiplying the i-value at each iteration by some prime and taking
            //the modulo of that product with length of the string.
            var uniqueVals = [];
            for(var i = 0; i < uniqueWords.length; i++){
                uniqueVals[i] = false;
            }
            var somePrime = 523;

            for(var i = 0; i < uniqueWords.length; i++){
                var newSpan = document.createElement("span");
                newSpan.id = uniqueWords[((somePrime * i) % (uniqueWords.length))] + "SPAN";
                textDiv.appendChild(newSpan);
                setSize(newSpan, uniqueWords[((somePrime * i) % (uniqueWords.length))]);
                newSpan.innerHTML += (uniqueWords[((somePrime * i) % (uniqueWords.length))] + " ");
            }
        };
        return newTextCloud;
    };
    return FW;
}