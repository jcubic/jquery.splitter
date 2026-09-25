/*!
 * TypeScript definitions for jQuery Splitter Plugin
 * Copyright (C) 2010-2026 Jakub T. Jankiewicz <https://jcubic.pl/me>
 *
 * Released under the terms of the GNU Lesser General Public License
 * <http://www.gnu.org/licenses/lgpl.html>
 */

/// <reference types="jquery" />

declare namespace JQuerySplitter {
    type Orientation = 'horizontal' | 'vertical';

    /**
     * Single position, a number is interpreted as pixels, a string can use
     * `px` or `%` suffix (e.g. `'50%'`).
     */
    type Position = number | string;

    /**
     * Position of every splitter, an array is required when there are more
     * than two panels, its length need to be `panels.length - 1`.
     */
    type PositionArgument = Position | Position[];

    /**
     * How many pixels from the edge the splitter can't be moved to.
     */
    interface LimitObject {
        leftUpper: number;
        rightBottom: number;
    }

    /**
     * A number is a shorthand for the same limit on both sides.
     */
    type Limit = number | LimitObject;

    /**
     * The splitter binds both mouse and touch events, `pageX`/`pageY` are only
     * available for mouse events, for touch events use
     * `event.originalEvent.changedTouches`.
     */
    type DragEvent = JQuery.MouseEventBase<HTMLElement, undefined, HTMLElement, HTMLElement> |
        JQuery.TouchEventBase<HTMLElement, undefined, HTMLElement, HTMLElement>;

    type DragHandler = (event: DragEvent) => void;

    interface Options {
        /**
         * Number of pixels (or object with a limit per side) where the splitter
         * can't be moved to the edge, default `100`.
         */
        limit?: Limit;
        /**
         * Direction the panels are laid out in, default `'horizontal'`.
         */
        orientation?: Orientation;
        /**
         * Comma separated list of html tags that are not treated as panels,
         * default `'script,style,link'`.
         */
        ignoreTags?: string;
        /**
         * Initial position of the splitter(s), default `'50%'` (for more than
         * two panels the default is an array of equal percentages).
         */
        position?: PositionArgument;
        /**
         * If true the splitter is not rendered between the panels.
         */
        invisible?: boolean;
        /**
         * Fired when the user starts dragging the splitter, the event object
         * is from mousedown/touchstart.
         */
        onDragStart?: DragHandler;
        /**
         * Fired when the user stops dragging the splitter, the event object
         * is from mouseup/touchend.
         */
        onDragEnd?: DragHandler;
        /**
         * Fired while dragging the splitter, the event object is from
         * mousemove/touchmove.
         */
        onDrag?: DragHandler;
        /**
         * Use `%` instead of `px` for the panels (useful for print or when
         * resizing the window), default `false` (`true` for more than two
         * panels).
         */
        percent?: boolean;
    }

    /**
     * Options with the defaults applied, as stored on the splitter instance.
     */
    type Settings = Required<Options>;
}

/**
 * jQuery object returned by `$(...).split()`, it has all jQuery methods plus
 * the splitter API. Note that `position()` is replaced by the plugin, it no
 * longer return the jQuery coordinates object.
 */
interface JQuerySplitter<TElement = HTMLElement> extends JQuery<TElement> {
    /**
     * Options the splitter was created with, with the defaults applied.
     */
    settings: JQuerySplitter.Settings;
    /**
     * Orientation the splitter was created with.
     */
    orientation: JQuerySplitter.Orientation;
    /**
     * Limit the splitter was created with, normalized into an object.
     */
    limit: JQuerySplitter.LimitObject;
    /**
     * Recalculate the position of the splitter(s) if the container was resized.
     */
    refresh(): void;
    /**
     * Get the position of every splitter in pixels.
     */
    position(): number[];
    /**
     * Set the position of the splitter(s), with `silent` set to true the
     * `splitter.resize` event is not triggered.
     */
    position(position: JQuerySplitter.PositionArgument, silent?: boolean): this;
    /**
     * Original jQuery method, it's replaced by the plugin and never called on
     * a splitter, it's only here so the instance stay compatible with JQuery.
     */
    position(): JQuery.Coordinates;
    /**
     * Get the value of an option.
     */
    option<K extends keyof JQuerySplitter.Settings>(name: K): JQuerySplitter.Settings[K];
    /**
     * Set the value of an option, only `'position'` is applied immediately.
     */
    option<K extends keyof JQuerySplitter.Settings>(name: K, value: JQuerySplitter.Settings[K]): this;
    /**
     * Check if the splitter is the one the user interact with.
     */
    isActive(): boolean;
    /**
     * Remove the splitter(s) and the styles and classes added to the panels.
     */
    destroy(): void;
}

interface JQuery<TElement = HTMLElement> {
    /**
     * Split the children of the element with movable splitters between them.
     *
     * Calling it again on the same element return the existing splitter.
     */
    split(options?: JQuerySplitter.Options): JQuerySplitter<TElement>;
}

declare module 'jquery.splitter' {
    const JQuerySplitterFactory: (root: Window, jQuery?: JQueryStatic) => JQueryStatic;
    export type JQuerySplitter = ReturnType<JQuery['split']>;
    export default JQuerySplitterFactory;
}
