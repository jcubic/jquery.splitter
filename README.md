# jQuery Splitter

[![npm](https://img.shields.io/badge/npm-0.29.1-blue.svg)](https://www.npmjs.com/package/jquery.splitter)
![bower](https://img.shields.io/badge/bower-0.29.1-yellow.svg)

jQuery Splitter is plugin that split your content with movable splitter between them.


## Example

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

## Limitations

You need to set the height of the container for splitter to work.

You can use this css:

```css
.container {
  height: 100vh !important;
}
```

to force full height.

If you have wrappers inside left or right splitter and you create another splitter inside:

```html
<div class="splitter"
  <div class="left">
    <div class="wrapper">
       <div class="top"></div>
       <div class="bottom"></div>
    </div>
  </div>
  <div class="right">
  </div>
</div>
```

wrapper is not directly inside left, so it will not get the full height (this is how CSS work),
so in order to fix this case, you need to set the wrapper to proper height. Most likely you want:

```css
.splitter .wrapper {
  height: 100%;
}
```

to fit full height of the left splitter.

## Options

* orientation - string 'horizontal' or 'vertical'.
* limit - number or object `{leftUpper: number, rightBottom: number}` that indicate how many pixels where you can't move the splitter to the edge.
* position - number or string with % indicate initial position of the splitter. (from version 0.28.0 you can use array of numbers or percents for multiple panels, array length need to have the same number as there are splitters so `children.length - 1`).
* onDrag - event fired when draging the splitter, the event object is from mousemove.
* percent - boolean that indicate if spliter should use % instead of px (for use in print or when calling the window).
* ignoreTags - a string with a comma separated list of html tags that should be ignored when creating splitter, default `"script,style,link"` (included in version 0.29.0).

## Methods

Instance returned by splitter is jQuery object with additional methods:

* `refresh()`
* `option (name[, value])` - option setter/getter
* `position(number)`|`position([num1, num2, ...])`|`position()` - position setter/getter (if you have 2 panels you can use single number to set the position for more panels you need to use array with `panels - 1` same as number of splitters)
* `isActive` - returns `boolean`
* `destroy()` - remove splitter data

## Demo

<http://jquery.jcubic.pl/splitter.php>

## Patch Contributors

* Robert Tupelo-Schneck
* Taras Strypko
* [Yury Plashenkov](https://github.com/plashenkov)
* [@beskorsova](https://github.com/beskorsova)

## License

Copyright (C) 2010-2020 Jakub T. Jankiewicz &lt;<https://jcubic.pl/me>&gt;<br/>
Released under the terms of the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
