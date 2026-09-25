<div align="center">

# jQuery Splitter

[![npm](https://img.shields.io/badge/npm-0.30.0-blue.svg)](https://www.npmjs.com/package/jquery.splitter)
[![github repo](https://img.shields.io/badge/github-repo-orange?logo=github)](https://github.com/jcubic/jquery.splitter)
[![LICENSE MIT](https://img.shields.io/badge/license-LGPL-blue.svg)](https://github.com/jcubic/jquery.splitter/blob/master/LICENSE)

</div>

jQuery Splitter is a plugin that splits your content with a movable splitter between them.


## Example

```javascript
var splitter = $('#foo').height(200).split({
    orientation: 'vertical',
    limit: 10,
    position: '50%', // if there is no percentage, it interprets it as pixels
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

You need to set the height of the container for the splitter to work.

You can use this CSS:

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

## TypeScript

The package ships with TypeScript definitions (`js/jquery.splitter.d.ts`), they extend the
global `JQuery` interface:

```typescript
import $ from 'jquery';
import splitter from 'jquery.splitter';
import 'jquery.splitter/css/jquery.splitter.css';

// This is needed when using bundlers like Vite or Webpack
splitter(window, $);

const splitter = $('#foo').height(200).split({
    orientation: window.innerWidth > 1000 ? 'vertical' : 'horizontal',
    limit: 10,
    position: '50%',
    onDrag(event) {
        console.log(splitter.position());
    }
});
```

The object returned by `split()` is typed as `JQuerySplitter`, the option and helper types
are in the `JQuerySplitter` namespace (`JQuerySplitter.Options`,
`JQuerySplitter.Orientation`, `JQuerySplitter.Limit`, `JQuerySplitter.Position`).

Note that `position()` on a splitter is the plugin method (it returns an array of pixel
positions), not the jQuery method that return coordinates.

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
