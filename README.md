# jQuery Splitter

[![npm](https://img.shields.io/badge/npm-0.27.0-blue.svg)](https://www.npmjs.com/package/jquery.resize)
![bower](https://img.shields.io/badge/bower-0.27.0-yellow.svg)

jQuery Splitter is plugin that split your content with movable splitter between them.


# Example

```javascript
var splitter = $('#foo').height(200).split({
    orientation: 'vertical',
    limit: 10,
    position: '50%', // if there is no percentage it interpret it as pixels
    onDrag: function(event) {
        console.log(splitter.position());
    }
});
```

```html
<div id="foo">
    <div id="leftPane">Foo</div>
    <div id="rightPane">Bar</div>
</div>
```

**Note**: You need to set the height of the container for splitter to work.

# Options

* orientation - string 'horizontal' or 'vertical'.
* limit - number or object `{leftUpper: number, rightBottom: number}` that indicate how many pixels where you can't move the splitter to the edge.
* position - number or string with % indicate initial position of the splitter.
* onDrag - event fired when draging the splitter, the event object is from mousemove
* percent - boolean that indicate if spliter should use % instead of px (for use in print)

# Demo

<http://jquery.jcubic.pl/splitter.php>

# Patch Contributors

* Robert Tupelo-Schneck
* Taras Strypko
* [Yury Plashenkov](https://github.com/plashenkov)
* [@beskorsova](https://github.com/beskorsova)

# License

Copyright (C) 2010-2017 Jakub Jankiewicz &lt;<http://jcubic.pl>&gt;

Released under the terms of the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
