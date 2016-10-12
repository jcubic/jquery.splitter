# jQuery Splitter

jQuery Splitter is plugin that split your content with movable splitter between them.

# Example

```javascript
$('#foo').height(200).split({
    orientation: 'vertical',
    limit: 10,
    position: '50%' // if there is no percentage it interpret it as pixels
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
* limit - number how many pixels where you can't move the splitter on the edge.
* position - number or string with % indicate initial position of the splitter.

# Demo

<http://jquery.jcubic.pl/splitter.php>

# Patch Contributors

* Robert Tupelo-Schneck
* Taras Strypko
* [Yury Plashenkov](https://github.com/plashenkov)

# License

Copyright (C) 2010-2013 Jakub Jankiewicz &lt;<http://jcubic.pl>&gt;

Released under the terms of the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
