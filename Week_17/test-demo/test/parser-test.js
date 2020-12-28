var assert = require('assert');

import {parseHTML} from "../html-parser/src/parser.js";


describe("parse html: ", function(){
    it('<a></a>', function() {
        let tree = parseHTML('<a></a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });
    // 属性相关
    it('<a href="//123"></a>', function() {
        let tree = parseHTML('<a href="//123"></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    // afterAttribute
    it('<a href ></a>', function() {
        let tree = parseHTML('<a href ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    it('<a href id ></a>', function() {
        let tree = parseHTML('<a href id ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    // doubleQuotedAttributeValue
    it('<a href="abc" id ></a>', function() {
        let tree = parseHTML('<a href="abc" id ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    // unQuotedAttributeValue
    it('<a id=abc ></a>', function() {
        let tree = parseHTML('<a id=abc ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    it('<a id=abc></a>', function() {
        let tree = parseHTML('<a id=abc></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    it('<a id=abc/>', function() {
        let tree = parseHTML('<a id=abc/>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    // selfClosingStartTag
    it('<a id=abc />', function() {
        let tree = parseHTML('<a id=abc />');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });  
    // singleQuotedAttributeValue
    it('<a id=\'abc\'/>', function() {
        let tree = parseHTML('<a id=\'abc\'/>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });  
    // beforeAttributeName
    it('<a/>', function() {
        let tree = parseHTML('<a/>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    }); 
    // tagname
    it('<A /> upper case', function() {
        let tree = parseHTML('<A />');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    // tagOpen
    it('<>', function() {
        let tree = parseHTML('<>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].type, "text");
    });
})