var utils = {
    removeColon : function (name){
        name = name.replace(':', '_');
        return name;
    },

    removeSpecialChars: function(word) {
        word = word.replace("'s", "");
        word = word.replace("?", "");
        word = word.replace("-", " ");
    
        return word;
    },

    spliceSlice: function(str, index, count, add) {
        return str.slice(0, index) + (add || "") + str.slice(index + count);
    }
}

module.exports = utils;